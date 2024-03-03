import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "../components";

const meta = {
  // 경로에 대한 정보를 나타냄
  title: "Buttons/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    alt: { control: "text", description: "이미지의 alt 속성", defaultValue: "icon" },
    iconPath: { control: "text", description: "이미지의 경로", defaultValue: "" },
    onClick: { action: "clicked", description: "버튼 클릭 이벤트" },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alt: "아이콘 alt 내용",
    iconPath: "/images/delete_icon.svg",
    /**
     * 1. 퍼블릭 경로인 svg 이미지 파일의 경로
     * "/image.svg"
     *
     * 2. src 디렉토리에 위치한 svg 이미지 파일의 경로
     * -> 마치 컴포넌트처럼 import해서 사용
     * import deleteIcon from "../assets/image.svg"
     * deleteIcon <- 를 경로 위치에
     *
     * 3. 따로 스토리지가 있는 경우 url 경로를 그냥 붙일 수 있음
     * */
  },
};
