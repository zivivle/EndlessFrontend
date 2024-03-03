interface IIconButtonProps {
  alt: string;
  iconPath: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  // onClick: React.MouseEventHandler<HTMLButtonElement>;
  // 아래처럼도 적용 가능
}

export const IconButton = ({ alt, iconPath, onClick }: IIconButtonProps) => {
  return (
    <button onClick={onClick}>
      <img src={iconPath} alt={alt} />
    </button>
  );
};
