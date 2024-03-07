interface ITagButtonProps {
    children: string;
    isChecked: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const TagButton = ({ children, isChecked, onClick }: ITagButtonProps) => {
    const buttonStyle = isChecked ? "bg-white text-primary" : "text-white bg-dark-opacity";
    return (
        <button
            className={` 
                border
                rounded-tag-button 
                px-[10px] 
                h-[33px] 
                text-sm
                font-medium
                ${buttonStyle}
            `}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
