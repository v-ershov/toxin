// for v2.2.3

interface AirDatepickerOptions {
  classes?: string;
  inline?: boolean;
  language?: string;
  startDate?: Date;
  firstDay?: number;
  weekends?: number[];
  dateFormat?: string;
  altField?: string | JQuery;
  altFieldDateFormat?: string;
  toggleSelected?: boolean;
  keyboardNav?: boolean;
  position?: string;
  offset?: number;
  view?: 'days' | 'months' | 'years';
  minView?: 'days' | 'months' | 'years';
  showOtherMonths?: boolean;
  selectOtherMonths?: boolean;
  moveToOtherMonthsOnSelect?: boolean;
  showOtherYears?: boolean;
  selectOtherYears?: boolean;
  moveToOtherYearsOnSelect?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disableNavWhenOutOfRange?: boolean;
  multipleDates?: boolean | number;
  multipleDatesSeparator?: string;
  range?: boolean;
  todayButton?: boolean | Date;
  clearButton?: boolean;
  showEvent?: string;
  autoClose?: boolean;
  prevHtml?: string;
  nextHtml?: string;
  navTitles?: { days?: string; months?: string; years?: string; };
  monthsField?: string;
  timepicker?: boolean;
  dateTimeSeparator?: string;
  timeFormat?: string;
  minHours?: number;
  maxHours?: number;
  minMinutes?: number;
  maxMinutes?: number;
  hoursStep?: number;
  minutesStep?: number;

  onSelect?: (formattedDate: string, date: Date | Date[], inst: AirDatepickerInstance) => void;
  onShow?: (inst: AirDatepickerInstance, animationCompleted: boolean) => void;
  onHide?: (inst: AirDatepickerInstance, animationCompleted: boolean) => void;
  onChangeMonth?: (month: number, year: number) => void;
  onChangeYear?: (year: number) => void;
  onChangeDecade?: (decade: number[]) => void;
  onChangeView?: (view: 'days' | 'months' | 'years') => void;
  onRenderCell?: (date: Date, cellType: 'day' | 'month' | 'year') => void;
}

interface AirDatepickerInstance extends AirDatepickerOptions {
  show(): void;
  hide(): void;
  destroy(): void;
  next(): void;
  prev(): void;
  selectDate(date: Date | Date[]): void;
  removeDate(date: Date): void;
  clear(): void;
  update(options: AirDatepickerOptions): void;

  view: 'days' | 'months' | 'years';
  date: Date;
  $datepicker: JQuery;
  selectedDates: Date[];
}

interface JQuery {
  datepicker(options?: AirDatepickerOptions): JQuery;
  data(type: 'datepicker'): AirDatepickerInstance;
}
