export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extends: {},
        fontFamily: {
            body: ["Open Sans Variable"],
        },
        borderRadius: {
            "primary-button": "5px",
            "tag-button": "17.5px",
        },
        fontSize: {
            xs: [
                "12px",
                {
                    lineHeight: "18px",
                    letterSpacing: "0",
                    fontWeight: "400",
                },
            ],
            sm: [
                "14px",
                {
                    lineHeight: "21px",
                    letterSpacing: "0",
                    fontWeight: "400",
                },
            ],
            base: [
                "16px",
                {
                    lineHeight: "24px",
                    letterSpacing: "0",
                    fontWeight: "400",
                },
            ],
            xl: ["20px", "30px"],
            "2xl": [
                "24px",
                {
                    lineHeight: "36px",
                    letterSpacing: "0",
                    fontWeight: "700",
                },
            ],
        },
        colors: {
            primary: " #1d2745",
            secondary: " #1de5d4",
            tertiary: " #f52c50",
            white: " #ffffff",
            mono100: " #f1f1f1",
            mono200: " #bebebe",
            mono300: " #d6d7d9",
            error: " #d01e1e",
            "dark-opacity": "rgba(255, 255, 255, 0.1)",
        },
    },
    plugins: [],
};
