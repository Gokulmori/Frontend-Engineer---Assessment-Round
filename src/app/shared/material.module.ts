import { NgModule } from '@angular/core';

// Form Controls
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

// Navigation
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';

// Layout
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';

// Buttons & Indicators
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';

// Popups & Modals
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

// Data Table
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

// Pickers
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Misc
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';

const MATERIAL_MODULES = [
  // Form Controls
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatRadioModule,

  // Navigation
  MatToolbarModule,
  MatMenuModule,
  MatSidenavModule,
  MatTabsModule,

  // Layout
  MatCardModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatListModule,

  // Buttons & Indicators
  MatButtonModule,
  MatIconModule,
  MatBadgeModule,
  MatChipsModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRippleModule,

  // Popups & Modals
  MatDialogModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatBottomSheetModule,

  // Data Table
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,

  // Pickers
  MatDatepickerModule,
  MatNativeDateModule,

  // Misc
  MatAutocompleteModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatStepperModule,
];

/**
 * SharedMaterialModule
 *
 * Central module that exports all Angular Material components.
 * Import this once in any standalone component's `imports` array
 * instead of importing individual Material modules.
 *
 * Usage in standalone component:
 *   imports: [SharedMaterialModule]
 *
 * Usage in NgModule-based component:
 *   imports: [SharedMaterialModule]
 *   exports: [SharedMaterialModule]  ← only if you need to re-export
 */
@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class MaterialModule {}
