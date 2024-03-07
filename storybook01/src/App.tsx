import "./App.css";
import { TagButtonList } from "./components";

function App() {
    return (
        <div className=" bg-primary w-screen h-screen">
            <TagButtonList tagList={["tag1", "tag2", "tag3"]} onTagClick={console.log} />
        </div>
    );
}

export default App;
