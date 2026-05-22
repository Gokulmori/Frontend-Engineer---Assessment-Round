import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { User, UserRole } from '../../shared/user.model';

@Component({
  selector: 'app-user-dashboard',
  imports: [CommonModule, MaterialModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})
export class UserDashboard {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
    @ViewChild('roleChart') roleChartRef!: ElementRef<HTMLCanvasElement>;  // ✅ ViewChild se canvas

  displayedColumns: string[] = ['index', 'name', 'email', 'role', 'createdAt'];
  dataSource = new MatTableDataSource<User>([]);

  chartLoading = false;
  tableLoading = false;
  private chart: any = null;
  private activeRoleFilter = 'all';

  roleCounts: Record<UserRole, number> = { Admin: 0, Editor: 0, Viewer: 0 };

  legendItems: { role: string; color: string; count: number; pct: string }[] = [];

  statsCards: any[] = [];

  private readonly destroy$ = new Subject<void>();

  readonly ROLE_COLORS: Record<UserRole, string> = {
    Admin: '#f87171',
    Editor: '#60a5fa',
    Viewer: '#4ade80',
  };

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userService.users$.pipe(takeUntil(this.destroy$)).subscribe((users) => {
      this.tableLoading = true;
      setTimeout(() => {
        // Apply role filter
        const filtered =
          this.activeRoleFilter === 'all'
            ? users
            : users.filter((u) => u.role === this.activeRoleFilter);
        this.dataSource.data = filtered;
        this.tableLoading = false;
        this.cdr.markForCheck();
      }, 300);

      // Update counts
      this.roleCounts = {
        Admin: users.filter((u) => u.role === 'Admin').length,
        Editor: users.filter((u) => u.role === 'Editor').length,
        Viewer: users.filter((u) => u.role === 'Viewer').length,
      };

      this.updateStatsCards(users.length);
      this.updateLegend(users.length);
      this.updateChart();
      this.cdr.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Custom filter predicate
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const search = filter.toLowerCase();
      return (
        data.name.toLowerCase().includes(search) ||
        data.email.toLowerCase().includes(search) ||
        data.role.toLowerCase().includes(search)
      );
    };

    setTimeout(() => {
      this.initChart();
    }, 300);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chart?.destroy();
  }

  private updateStatsCards(total: number): void {
    this.statsCards = [
      {
        label: 'Total Users',
        value: total,
        icon: 'people',
        theme: 'total',
        trend: '+' + total,
      },
      {
        label: 'Admins',
        value: this.roleCounts.Admin,
        icon: 'admin_panel_settings',
        theme: 'admin',
      },
      {
        label: 'Editors',
        value: this.roleCounts.Editor,
        icon: 'edit',
        theme: 'editor',
      },
      {
        label: 'Viewers',
        value: this.roleCounts.Viewer,
        icon: 'visibility',
        theme: 'viewer',
      },
    ];
  }

  private updateLegend(total: number): void {
    this.legendItems = (['Admin', 'Editor', 'Viewer'] as UserRole[]).map((role) => ({
      role,
      color: this.ROLE_COLORS[role],
      count: this.roleCounts[role],
      pct: total ? ((this.roleCounts[role] / total) * 100).toFixed(0) : '0',
    }));
  }

 private async initChart(): Promise<void> {
    // ✅ Chart.js lazy load
    const { Chart, ArcElement, DoughnutController, Tooltip, Legend } =
      await import('chart.js');

    Chart.register(ArcElement, DoughnutController, Tooltip, Legend);

    const canvas = this.roleChartRef?.nativeElement;
    console.log(canvas);
    
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Admin', 'Editor', 'Viewer'],
        datasets: [{
          data: [this.roleCounts.Admin, this.roleCounts.Editor, this.roleCounts.Viewer],
          backgroundColor: ['rgba(248,113,113,0.85)', 'rgba(96,165,250,0.85)', 'rgba(74,222,128,0.85)'],
          borderColor: ['rgba(248,113,113,1)', 'rgba(96,165,250,1)', 'rgba(74,222,128,1)'],
          borderWidth: 2,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw} users` },
            backgroundColor: 'rgba(13,13,26,0.95)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1, padding: 12,
            titleColor: '#fff', bodyColor: 'rgba(255,255,255,0.7)',
          },
        },
        animation: { animateRotate: true, animateScale: true, duration: 600, easing: 'easeInOutQuart' },
      },
    });

    this.cdr.markForCheck();
  }


  private updateChart(): void {
    if (!this.chart) return;

    this.chart.data.datasets[0].data = [
      this.roleCounts.Admin,
      this.roleCounts.Editor,
      this.roleCounts.Viewer,
    ];
    this.chart.update('active');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyRoleFilter(role: string): void {
    this.activeRoleFilter = role;
    const users = this.userService.currentUsers;
    const filtered = role === 'all' ? users : users.filter((u) => u.role === role);
    this.dataSource.data = filtered;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getRoleIcon(role: UserRole): string {
    return { Admin: 'admin_panel_settings', Editor: 'edit', Viewer: 'visibility' }[role];
  }

  async openAddUserModal(): Promise<void> {
    // Lazy-load the form component
    const { UserForm } = await import('../user-form/user-form');

    const dialogRef = this.dialog.open(UserForm, {
      width: '500px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-panel',
      backdropClass: 'custom-backdrop',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Table and chart update automatically via BehaviorSubject
      }
    });
  }
}
