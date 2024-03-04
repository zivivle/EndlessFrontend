import { IconButton } from "./IconButton";

interface INavigationBarProps {
    isDark: boolean;
    isShowBackButton: boolean;
    isShowCloseButton: boolean;
    isShowTitle: boolean;
    title?: string;
    onBackButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
    onCloseButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const NavigationBar = ({
    isDark,
    isShowBackButton,
    isShowCloseButton,
    isShowTitle,
    // 옵셔널일 경우 props에서 오류가 날 수 있으므로
    // default value를 주는 것이 좋다
    title = "",
    onBackButtonClick = () => {},
    onCloseButtonClick = () => {},
}: INavigationBarProps) => {
    return (
        <div className="w-full flex justify-between">
            {/* 뒤로가기 버튼 */}
            <div className="navigation-title-wrapper flex">
                {isShowBackButton && (
                    <IconButton
                        alt="prev-icon"
                        iconPath={`/images/prev_icon${isDark ? "_white" : ""}.svg`}
                        onClick={onBackButtonClick}
                    />
                )}

                {/* 페이지 이름 */}
                {isShowTitle && (
                    <h1 className={`text-2xl ${isDark ? "text-white" : "text-primary"}`}>
                        {title}
                    </h1>
                )}
            </div>

            {/* 닫기 버튼 */}
            {isShowCloseButton && (
                <IconButton
                    alt="delete-icon"
                    iconPath={`/images/delete_icon${isDark ? "_white" : ""}.svg`}
                    onClick={onCloseButtonClick}
                />
            )}
        </div>
    );
};
