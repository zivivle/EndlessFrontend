/**
 * 다양한 스토리를 표현할 때
 * TypeScript의 Record Type을 활용해서 관리하는 방법
 */

type PrimaryButtonTheme = "dark" | "light" | "social" | "text";

interface IPrimaryButtonProps {
    theme: PrimaryButtonTheme;
    disabled: boolean;
    children: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const dark = "bg-primary text-white";
const light = "bg-white text-primary";
const social = "bg-social text-white";
const text = "bg-transparent text-white";
// 테일윈드에서 제공하는 접두사 사용!!
const disabledStyle = "disabled:bg-mono100 disabled:text-mono200";

const color: Record<PrimaryButtonTheme, string> = {
    dark,
    light,
    social,
    text,
};

export const PrimaryButton = ({ theme, disabled, onClick, children }: IPrimaryButtonProps) => {
    return (
        <button
            className={`
                w-full 
                h-[59px] 
                rounded-primary-button 
                ${disabledStyle}
                ${color[theme]}
            `}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
