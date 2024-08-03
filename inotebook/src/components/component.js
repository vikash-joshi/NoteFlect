import { useMyContext } from "../context/themeContext";


export default function MyComponent () {
  const { state, setState } = useMyContext();

  return (
    <div>
      <p>{state}</p>
      <button onClick={() => setState(state==='light' ? 'dark':'light')}>Change Value</button>
    </div>
  );
};