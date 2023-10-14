import {useState, useMemo} from 'react'

const useForceUpdate = () => {
  const globalState = useMemo(() => ({forceUpdateCount: 0}), []);
  const [, setForceUpdateCount] = useState(0);
  return useCallback(() => {
    globalState.forceUpdateCount += 1;
    setForceUpdateCount(globalState.forceUpdateCount);
  }, []);
};
export default useForceUpdate
