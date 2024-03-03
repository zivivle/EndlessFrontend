import { useState } from "react";
import { ErrorMessage } from "./ErrorMessage";
import { IconButton } from "./IconButton";

interface IDefaultTextFieldProps {
    errorMessage: string;
    iconPath: string;
    iconAlt: string;
    onIconClick: React.MouseEventHandler<HTMLButtonElement>;
    placeholder: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    value: string;
    isError: boolean;
    id: string;
}

export const DefaultTextField = ({
    errorMessage,
    iconPath,
    iconAlt,
    onIconClick,
    placeholder,
    onChange,
    value,
    isError,
    id,
}: IDefaultTextFieldProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const borderColor = isFocused
        ? "border-secondary"
        : !value
          ? "border-mono300"
          : "border-primary";
    return (
        <div className="relative">
            {/* 
              그러므로 CLS를 최대한 줄이기 위해 
              ErrorMessage를 absolute 로 변경해야 한다
            */}
            <div
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`text-primary border-b ${borderColor}`}
            >
                <input
                    id={id}
                    className="outline-none"
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                {!!value && <IconButton alt={iconAlt} iconPath={iconPath} onClick={onIconClick} />}
            </div>
            {/* 
              최대한 부모요소를 만들기 않는 방법이 더 좋다.
            */}
            {isError && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </div>
    );
};
