import {
  Component,
  input,
  output,
  OnInit,
  computed,
  signal,
  inject,
} from '@angular/core';
import { EnumService } from '../../../enum/services/enum.service';
import { EnumLabelPipe } from '../../../tournament/pipes/enum-label.pipe';
import {
  EnumName,
  EnumOption,
} from '../../../enum/interfaces/enum.interface';

@Component({
  selector: 'drop-down',
  standalone: true,
  imports: [EnumLabelPipe],
  templateUrl: './drop-down.component.html',
})
export class DropDownComponent implements OnInit {
  // Inputs
  enumName = input.required<EnumName>();
  selectedValue = input<string>('');
  placeholder = input<string>('Seleccionar opción');
  clearText = input<string>('Limpiar selección');
  showClearOption = input<boolean>(true);
  disabled = input<boolean>(false);

  // Outputs
  valueChange = output<string>();
  optionSelected = output<EnumOption>();

  // Services
  private enumService = inject(EnumService);

  // Signals
  options = signal<EnumOption[]>([]);
  loading = signal<boolean>(false);
  isOpen = signal<boolean>(false);

  // Computed
  selectedLabel = computed(() => {
    const selectedOption = this.options().find(
      (option) => option.value === this.selectedValue()
    );
    return selectedOption ? selectedOption.value ?? selectedOption.value : '';
  });

  ngOnInit(): void {
    this.loadOptions();
  }

  private loadOptions(): void {
    this.loading.set(true);

    this.enumService.getEnumValues(this.enumName()).subscribe({
      next: (options: EnumOption[]) => {
        this.options.set(options);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading enum options:', error);
        this.options.set([]);
        this.loading.set(false);
      },
    });
  }

  toggleDropdown(): void {
    if (this.disabled()) return;
    this.isOpen.set(!this.isOpen());
  }

  closeDropdown(): void {
    setTimeout(() => {
      this.isOpen.set(false);
    }, 150);
  }

  selectOption(option: EnumOption): void {
    this.valueChange.emit(option.value);
    this.optionSelected.emit(option);
    this.isOpen.set(false);
  }

  clearSelection(): void {
    this.valueChange.emit('');
    this.optionSelected.emit({ value: '' });
    this.isOpen.set(false);
  }

  getPlaceholderText(): string {
    return this.placeholder() || 'Seleccionar opción';
  }
}
