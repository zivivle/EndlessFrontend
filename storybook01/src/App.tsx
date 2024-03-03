import { useState } from "react";
import "./App.css";
import { DefaultTextField, Label } from "./components";

function App() {
    const [userInputFormValue, setUserInputFormValue] = useState({
        username: "",
        address: "",
    });
    const [isError, setIsError] = useState(false);
    return (
        <div className="w-[400px]">
            <Label htmlFor="username">사용자 이름</Label>
            <DefaultTextField
                errorMessage="입력값을 확인해주세요."
                iconPath="/images/delete_icon.svg"
                iconAlt="delete_icon"
                onIconClick={() => {}}
                placeholder="이름을 입력해주세요."
                onChange={(e) =>
                    setUserInputFormValue((prev) => ({
                        ...prev,
                        username: e.target.value,
                    }))
                }
                value={userInputFormValue.username}
                isError={isError}
                id="username"
            />
            <div className="my-20" />
            <Label htmlFor="address">사용자 주소</Label>
            <DefaultTextField
                errorMessage="입력값을 확인해주세요."
                iconPath="/images/delete_icon.svg"
                iconAlt="delete_icon"
                onIconClick={() => {}}
                placeholder="주소을 입력해주세요."
                onChange={(e) =>
                    setUserInputFormValue((prev) => ({
                        ...prev,
                        address: e.target.value,
                    }))
                }
                value={userInputFormValue.address}
                isError={isError}
                id="address"
            />
            <button
                onClick={() => {
                    setIsError((prev) => !prev);
                }}
            >
                Error 토글
            </button>
        </div>
    );
}

export default App;
