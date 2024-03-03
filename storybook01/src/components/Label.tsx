interface ILabelProps {
  htmlFor: string;
  children: string;
}

export const Label = ({ htmlFor, children }: ILabelProps) => {
  return (
    <label className="text-sm text-secondary" htmlFor={htmlFor}>
      {children}
    </label>
  );
};

/**
 * htmlFor 속성은 React에서 <label> 태그와 관련된 폼 요소(예를 들어 input, textarea, select 등)를 식별하기 위해 사용된다. HTML에서는 for 속성이라고 하지만, React에서는 Javascript의 예약어인 for대신 htmlFor를 사용한다.
 * htmlFor 속성의 값은 관련된 폼 요소의 id 속성 값과 일치해야 한다. 이를 통해 라벨을 클릭하면 연결된 폼 요소가
 * 포커스되면서 활성화된다. 이는 사용자 인터페이스의 접근성과 사용성을 향상시키는 중요한 기능이다.
 *
 * @ 예시 코드
 * <label htmlFor="username">사용자 이름</label>
 * <input type="text" id="username" name="username" />
 */
