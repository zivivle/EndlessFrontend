import type { Meta, StoryObj } from "@storybook/react";
import { NavigationBar } from "../components";

const meta = {
    // 경로에 대한 정보를 나타냄
    title: "TextFields/NavigationBar",
    component: NavigationBar,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    //만약 스토리에 width가 적용되지 않는 상황일때
    //decorators 속성 사용 가능
    //주의 사항: decorators를 사용하여면 stories 파일 확장자명을 tsx로 수정해야함
    decorators: [
        (Story: any) => (
            <div style={{ width: "360px" }}>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        isDark: {
            control: "boolean",
            description: "다크모드 여부",
            defaultValue: false,
        },
        isShowBackButton: {
            control: "boolean",
            description: "뒤로가기 버튼을 보여줄지 여부 상태",
            defaultValue: true,
        },
        isShowCloseButton: {
            control: "boolean",
            description: "닫기 버튼을 보여줄지 여부 상태",
            defaultValue: true,
        },
        isShowTitle: {
            control: "boolean",
            description: "제목을 보여줄지 여부 상태",
            defaultValue: true,
        },
        title: {
            control: "text",
            description: "제목",
            defaultValue: "제목",
        },
        onBackButtonClick: {
            action: "clicked",
            description: "뒤로가기 버튼을 눌렀을 때 호출되는 함수",
        },
        onCloseButtonClick: {
            action: "clicked",
            description: "닫기 버튼을 눌렀을 때 호출되는 함수",
        },
    },
} satisfies Meta<typeof NavigationBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        isDark: false,
        isShowBackButton: true,
        isShowCloseButton: true,
        isShowTitle: true,
        title: "제목",
    },
};
