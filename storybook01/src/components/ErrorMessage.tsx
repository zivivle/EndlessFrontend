interface IErrorMessageProps {
  children: string;
}

export const ErrorMessage = ({ children }: IErrorMessageProps) => {
  return <p className="text-xs text-error">{children}</p>;
};
