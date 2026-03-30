import type { InputProps } from "@/types/uiSchema.ts";
import { showNotification } from "@/utils/showNotification.tsx";
import { useCallback, useEffect, useState } from "react";

const TextArea: React.FC<Extract<InputProps, { inputType: "text" }>> = ({
  placeholder,
  value: defaultValue = "",
  onChange,
  validation,
}) => {
  const [value, setValue] = useState<string>(defaultValue);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const validate = useCallback(
    (val: string): boolean => {
      const result = validation?.(val);

      if (typeof result !== "boolean" && result && !result.success && result?.error) {
        showNotification({
          message: result.error.issues?.[0].message || "Invalid input",
          isError: true,
        });
      }

      const success = typeof result === "boolean" ? result : (result?.success ?? true);
      setIsValid(success);
      return success;
    },
    [validation],
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (validate(newValue)) {
      onChange?.(newValue);
    }
  };

  return (
    <div className="lucid-input-wrapper textarea">
      <textarea
        className={`lucid-input textarea${!isValid ? " error" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        rows={6}
      />
    </div>
  );
};

export default TextArea;
