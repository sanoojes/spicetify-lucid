import type { InputProps } from '@/types/uiSchema.ts';
import UI from '@/components/ui';
import { Add16Filled, Subtract16Filled } from '@fluentui/react-icons';
import debounce from '@/utils/debounce.ts';
import { showNotification } from '@/utils/showNotification.tsx';
import { useCallback, useMemo, useState } from 'react';

const Input: React.FC<InputProps> = (props) => {
  const { inputType, placeholder, className, icon } = props;

  const [isValid, setIsValid] = useState(true);

  const [value, setValue] = useState<string | number>(
    props.value ?? (inputType === 'number' ? 0 : '')
  );

  const debouncedOnChange = useMemo(() => {
    return debounce((val: string | number) => {
      if (inputType === 'number') {
        (props as Extract<InputProps, { inputType: 'number' }>).onChange(Number(val));
      } else {
        (props as Extract<InputProps, { inputType: 'text' }>).onChange(val.toString());
      }
    }, 300);
  }, [inputType, props]);

  const validate = useCallback(
    (raw: string | number): boolean => {
      const valueToValidate = inputType === 'number' ? Number(raw) : raw.toString();
      const { validation } = props as any;

      const result = validation?.(valueToValidate);

      if (typeof result === 'boolean') {
        setIsValid(result);
        return result;
      }

      if (result?.success === false) {
        const issues = result.error?.issues;

        showNotification({
          message: issues?.[0]?.message || 'Invalid input',
          isError: true,
          id: 'input-notify',
        });

        if (inputType === 'number' && issues?.length) {
          const minIssue = issues.find((i: any) => i?.code === 'too_small');
          const maxIssue = issues.find((i: any) => i?.code === 'too_big');

          let corrected = Number(valueToValidate);
          if (minIssue) corrected = Math.max(corrected, minIssue.minimum);
          if (maxIssue) corrected = Math.min(corrected, maxIssue.maximum);

          if (corrected !== valueToValidate) {
            setIsValid(false);
            return false;
          }
        }

        setIsValid(false);
        return false;
      }

      setIsValid(true);
      return true;
    },
    [inputType, props]
  );

  const updateValue = (raw: string | number) => {
    setValue(raw);
    const isValidInput = validate(raw);
    if (isValidInput) {
      debouncedOnChange(raw);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateValue(e.target.value);
  };

  const getNumericValue = (): number => {
    const parsed = typeof value === 'number' ? value : parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const increment = () => {
    if (inputType !== 'number') return;
    const step = (props as Extract<InputProps, { inputType: 'number' }>)?.step ?? 1;
    const next = getNumericValue() + step;
    updateValue(next);
  };

  const decrement = () => {
    if (inputType !== 'number') return;
    const step = (props as Extract<InputProps, { inputType: 'number' }>)?.step ?? 1;
    const next = getNumericValue() - step;
    updateValue(next);
  };

  return (
    <div
      className={`lucid-input-wrapper ${inputType === 'number' ? 'number' : 'text'} ${icon ? 'has-icon' : ''}`}
    >
      {inputType === 'number' && (
        <UI.Tippy label="Decrement" hasIcon={false}>
          <UI.Button variant="icon-no-border" onClick={decrement} aria-label="Decrement">
            <Subtract16Filled />
          </UI.Button>
        </UI.Tippy>
      )}
      {icon}
      <input
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className={`lucid-input ${className ? className : ''}${!isValid ? ' error' : ''}`}
        type={inputType}
        {...(inputType === 'number' ? { inputMode: 'decimal' } : {})}
      />
      {inputType === 'number' && (
        <UI.Tippy label="Increment" hasIcon={false}>
          <UI.Button variant="icon-no-border" onClick={increment} aria-label="Increment">
            <Add16Filled />
          </UI.Button>
        </UI.Tippy>
      )}
    </div>
  );
};

export default Input;
