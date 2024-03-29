## useQuery 기본 문법

- [useQuery 공식 문서](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery)
- useQuery는 v5부터 인자로 단 하나의 객체만 받는다. 그 중에 첫 번째 인자가 queryKey, queryFn가 필수 값이다.

```javascript
const result = useQuery({
  queryKey, // required
  queryFn, // required
  // ...options ex) gcTime, staleTime, select, ...
});

result.data;
result.isLoading;
result.refetch;
// ...
```

```javascript
const getAllSuperHero = async () => {
  return await axios.get("http://localhost:4000/superheroes");
};

const { data, isLoading } = useQuery({
  queryKey: ["super-heroes"],
  queryFn: getAllSuperHero,
});
```

### 1. queryKey

- queryKey는 데이터를 고유하게 식별할 수 있는 값과 플러스로 추가 쿼리 값을 쿼리 함수에 아래와 같이 편리하게 전달할 수도 있다.

```javascript
const getSuperHero = async ({ queryKey }: any) => {
  const heroId = queryKey[1]; // queryKey: ['super-hero', '3']

  return await axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

const useSuperHeroData = (heroId: string) => {
  return useQuery({
    queryKey: ["super-hero", heroId],
    queryFn: getSuperHero, // (*)
  });
};
```

- userQuery의 queryKey는 배열로 지정해줘야 한다.
  - 이는 단일 문자열만 포함된 배열이 될 수도 있고, 여러 문자열과 중첩된 객체로 구성된 복잡한 형태일 수도 있다.

```javascript
// An individual todo
useQuery({ queryKey: ['todo', 5], ... })

// An individual todo in a "preview" format
useQuery({ queryKey: ['todo', 5, { preview: true }], ...})
```

- useQuery는 queryKey를 기반으로 쿼리 캐싱을 관리하는 것이 핵심이다.
  - 만약, 쿼리가 특정 변수에 의존한다면 배열에다 이어서 줘야 한다. <br/>
    ex) ["super-hero", heroId, ...]
  - 이는 사실 굉장히 중요하다. 예를 들어 queryClient.setQueryData 등과 같이 특정 쿼리에 접근이 필요할 때 초기에 설정해둔 포맷을 지켜줘야 제대로 쿼리에 접근할 수 있다.
  - 아래 options 예제를 살펴보면 useSuperHeroData의 queryKey는 ["super-hero", heroId] 이다. 그렇다면 queryClient.setQueryData를 이용할 때 똑같이 ["super-hero", heroId] 형식을 가져야 한다. 그렇지 않으면 원하는 쿼리 접근이 안된다.

### 2. queryFn

- useQuery의 queryFn는 Promise를 반환하는 함수를 넣어야한다.
- ex) 상단의 queryKey 예제와 반대로 queryFn 자체적으로 인자를 받는 형태

```javascript
const getSuperHero = async (heroId: string) => {
  return await axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

const useSuperHeroData = (heroId: string) => {
  return useQuery({
    queryKey: ["super-hero", heroId],
    queryFn: () => getSuperHero(heroId), // (*)
  });
};
```

### 3. options

- [useQuery 공식 문서](https://tanstack.com/query/v5/docs/react/reference/useQuery)
  <br/> 더 많은 옵션은 아래에 자세히 정리할 예정.
- useQuery의 options에 많이 쓰이는 옵션들은 아래와 같다.

```javascript
const useSuperHeroData = (heroId: string) => {
  return useQuery({
    queryKey: ["super-hero", heroId],
    queryFn: () => getSuperHero(heroId),
    gcTime: 5 * 60 * 1000, // 5분
    staleTime: 1 * 60 * 1000, // 1분
    retry: 1,
    // ... options
  });
};
```

### useQuery 주요 리턴 데이터

```javascript
const {
  data,
  error,
  status,
  fetchStatus,
  isLoading,
  isFetching,
  isError,
  refetch,
  // ...
} = useQuery({
  queryKey: ["super-heroes"],
  queryFn: getAllSuperHero,
});
```

- **data**: 쿼리 함수가 리턴한 Promise에서 resolved된 데이터
- **error**: 쿼리 함수에 오류가 발생한 경우, 쿼리에 대한 오류 객체
- **status**: data, 쿼리 결과 값에 대한 상태를 표시하는 status는 문자열 형태로 3가지 값이 존재한다.
  - pending: 쿼리 데이터가 없고, 쿼리 시도가 아직 완료되지 않은 상태.
    - {enabled: false} 상태로 쿼리가 호출되면 이 상태로 시작된다.
    - [Dependent Queries 공식 문서](https://tanstack.com/query/v5/docs/react/guides/dependent-queries)
  - error: 에러 발생했을 때 상태
  - success: 쿼리 함수가 오류 없이 요청 성공하고 데이터를 표시할 준비가 된 상태.
- **fetchStatus**: queryFn에 대한 정보를 나타냄
  - fetching: 쿼리가 현재 실행중인 상태
  - paused: 쿼리를 요청했지만, 잠시 중단된 상태 (network mode와 연관)
  - idle: 쿼리가 현재 아무 작업도 수행하지 않는 상태
- **isLoading**: 캐싱된 데이터가 없을 때 즉, 처음 실행된 쿼리일 때 로딩 여부에 따라 true/false로 반환된다.
  - 이는 캐싱된 데이터가 있다면 로딩 여부에 상관없이 false를 반환한다.
  - isfetching && isPending 와 동일하다
- **isFetching**: 캐싱 된 데이터가 있더라도 쿼리가 실행되면 로딩 여부에 따라 true/false를 반환한다.
- **isSuccess**: 쿼리 요청이 성공하면 true
- **isError**: 쿼리 요청중에 에러가 발생한 경우 true
- **refetch**: 쿼리를 수동으로 다시 가져오는 함수.
- **그 외 반환 데이터들을 자세히 알고 싶으면 useQuery 공식 문서를 참조**

> **status, fetchStatus를 왜 나누는 걸까?**

- [Why Two Different States 공식 문서](https://tanstack.com/query/v5/docs/react/guides/queries#why-two-different-states)
- fetchStatus는 HTTP 네트워크 연결 상태와 좀 더 관련된 상태 데이터이다.
  - 예를 들어, status가 success 상태면 fetchStatus는 idle 상태지만, 백그라운드에서 refetch가 발생했을 때 fetching 상태일 수 있다.
  - status가 보통 loading 상태일 때 fetchStatus는 주로 fetching 상태를 갖지만, 네트워크 연결이 되어 있지 않은 경우 paused 상태를 가질 수 있다.
- 정리하자면 아래와 같다.
  - status는 data가 있는 지 없는지에 대한 상태를 의미한다.
  - fetchStatus는 쿼리 즉, queryFn 요청이 진행중인지 아닌지에 대한 상태를 의미한다.

## useQuery 주요 옵션

### staleTime과 gcTime

- stale은 용어 뜻대로 썩은 이라는 의미이다. 즉, 최신 상태가 아니라는 의미이다.
- fresh는 뜻 그대로 신선한 이라는 의미이다. 즉, 최신 상태라는 의미이다.

```javascript
const {
  data,
  // ...
} = useQuery({
  queryKey: ["super-heroes"],
  queryFn: getAllSuperHero,
  gcTime: 5 * 60 * 1000, // 5분
  staleTime: 1 * 60 * 1000, // 1분
});
```

1. staleTime: (number | Infinity)
   - staleTime은 데이터가 frech에서 stale 상태로 변경되는 데 걸리는 시간, 만약 staleTime이 3000이면 fresh상태에서 3초 뒤에 stale로 변환
   - fresh 상태일 때는 쿼리 인스턴스가 새롭게 mount되어도 네트워크 요청이 일어나지 않는다.
   - 참고로, staleTime의 기본값은 0이기 때문에 일반적으로 fetch 후에 바로 stale이 된다.
2. gcTime: (number | Infinity)
   - 데이터가 사용하지 않거나, inactive 상태일 때 캐싱된 상태로 남아있는 시간(밀리초)이다.
   - 쿼리 인스턴스가 unmount되면 데이터가 inactive 상태로 변경되며, 캐시는 gcTime만큼 유지된다.
   - gcTime이 지나면 가비지 콜렉터로 수집된다.
   - gcTime이 지나기 전에 쿼리 인스턴스가 다시 mount되면, 데이터를 fetch하는 동안 캐시 데이터를 보여준다.
   - gcTime은 staleTime과 관계없이, 무조건 inactive된 시점을 기준으로 캐시 데이터 삭제를 결정한다.
   - gcTime의 기본값은 5분이다. SSR환경에서는 Infinity이다.

- 여기서 주의할 점은 staleTime과 gcTime의 기본값은 각각 0분과 5분이다. 따라서 staleTime에 어떠한 설정도 하지 않으면 해당 쿼리를 사용하는 컴포넌트(Observer)가 mount됐을 때 매번 다시 API를 요청할 것이다.
- staleTime을 gcTime보다 길게 설정했다고 가정하면, staleTime 만큼의 캐싱을 기대했을 때 원하는 결과를 얻지 못할 것이다. 즉, 두 개의 옵션을 적절하게 설정해줘야 한다.
  - 참고로, tkDodo의 reply에 따르면 tkDodo는 staleTime을 gcTime보다 작게 설정하는 것이 좋다는 의견에 동의하지 않는다고 한다.
  - 예컨대, staleTime이 60분일지라도 유저가 자주 사용하지 않는 데이터라면 굳이 gcTime을 60분 이상 설정하는 메모리 낭비가 필요가 없다.

### refetchOnMount

```javascript
const {
  data,
  // ...
} = useQuery({
  queryKey: ["super-heroes"],
  queryFn: getAllSuperHero,
  refetchOnMount: true,
});
```

- refetchOnMount: boolean | "always" | ((query: Query) => boolean | "always")
- refetchOnMount는 데이터가 stale 상태일 경우, mount마다 refetch를 실행하는 옵션이다.
- refechOnMount의 기본값은 true이다.
- always로 설정하면 마운트 시마다 매번 refetch를 실행한다.
  false로 설정하면 최초 fetch 이후에는 refetch하지 않는다.

### refetchOnWindowFocus

```javascript
const {
  data,
  // ...
} = useQuery({
  queryKey: ["super-heroes"],
  queryFn: getAllSuperHero,
  refetchOnWindowFocus: true,
});
```

- refetchOnWindowFocus: boolean | "always" | ((query: Query) => boolean | "always")
- refetchOnWindowFocus는 데이터가 stale 상태일 경우 윈도우 포커싱 될 때마다 refetch를 실행하는 옵션이다.
- refetchOnWindowFocus의 기본값은 true이다.
- 예를 들어, 크롬에서 다른 탭을 눌렀다가 다시 원래 보던 중인 탭을 눌렀을 때도 이 경우에 해당한다. 심지어 F12로 개발자 도구 창을 켜서 네트워크 탭이든 콘솔 탭이든 개발자 도구 창에서 놀다가 페이지 내부를 다시 클릭했을 때도 이 경우에 해당한다.
- always로 설정하면 항상 윈도우 포커싱될 때마다 refetch를 실행한다는 의미다.

### Polling

```javascript
const {
  data,
  // ...
} = useQuery({
  queryKey: ["super-heroes"],
  queryFn: getAllSuperHero,
  refetchInterval: 2000,
  refetchIntervalInBackground: true,
});
```

> Polling(폴링) 이란?
> 리얼타임 웹을 위한 기법으로 "일정한 주기(특정한 시간)"을 가지고 서버와 응답을 주고 받는 방식이다.
> react-query에서는 "refetchInterval", "refetchIntervalInBackground"을 이용해서 구현할 수 있다.

1. **refetchInterval**: number | false | ((data: TData | undefined, query: Query) => number | false)
   - refetchInterval은 시간(ms)를 값으로 넣어주면 일정 시간마다 자동으로 refetch를 시켜준다.
2. **refetchIntervalInBackground**: boolean
   - refetchIntervalInBackground는 refetchInterval과 함께 사용하는 옵션이다.
   - 탭/창이 백그라운드에 있는 동안 refetch 시켜준다. 즉, 브라우저에 focus되어 있지 않아도 refetch를 시켜주는 것을 의미한다.

### enabled refetch

```javascript
const {
  data,
  refetch,
  // ...
} = useQuery({
  queryKey: ["super-heroes"],
  queryFn: getAllSuperHero,
  enabled: false,
});

const handleClickRefetch = useCallback(() => {
  refetch();
}, [refetch]);

return (
  <div>
    {data?.data.map((hero: Data) => (
      <div key={hero.id}>{hero.name}</div>
    ))}
    <button onClick={handleClickRefetch}>Fetch Heroes</button>
  </div>
);
```

- **enabled**: boolean
- enabled는 쿼리가 자동으로 실행되지 않도록 할 때 설정할 수 있다.
- enabled를 false를 주면 쿼리가 자동 실행되지 않는다.
  - useQuery 반환 값 중 status가 pending 상태로 시작한다.
- **refetch**는 쿼리를 수동으로 다시 요청하는 기능이다.
  - 오류를 발생시키려면 throwOnError 속성을 true로 해서 전달해야 한다.
- 보통 자동으로 쿼리 요청을 하지 않고 버튼 클릭이나 특정 이벤트를 통해 요청을 시도할 때 같이 사용한다.
- 주의 할 점은 enabled: false를 줬다면 queryClient가 쿼리를 다시 가져오는 방법 중 invalidateQueries와 refetchQuerise를 무시한다.

### retry

```javascript
const {
  data,
  refetch,
  // ...
} = useQuery({
  queryKey: ["super-heroes"],
  queryFn: getAllSuperHero,
  retry: 10, // 오류를 표시하기 전에 실패한 요청을 10번 재시도합니다.
});
```

- **retry**: (boolean | number | (failureCount: number, error: TError) => boolean)
- retry는 쿼리가 실패하면 useQuery를 특정 횟수만큼 재요청하는 옵션이다.
- retry가 false인 경우, 실패한 쿼리는 기본적으로 다시 시도하지 않는다. true인 경우에는 실패한 쿼리에 대해서 무한 재요청을 시도한다.
- 값으로 숫자를 넣을 경우, 실패한 쿼리가 해당 숫자를 충족할 때까지 요청을 재시도한다.
- 기본 값은 클라이언트 환경에서 3, 서버환경에서 0이다.

### onSuccess, OnError, onSettled

- \*\*v4까지 있던 onSuccess, onError, onSettled Callback은 useQuery 옵션에서 deprecated됐다. 단, useMutation에서는 사용 가능하다.
- [Breaking React Query's API on purpose 참고](https://velog.io/@cnsrn1874/breaking-react-querys-api-on-purpose)

### select

```javascript
const {
  data,
  refetch,
  // ...
} = useQuery({
  queryKey: ["super-heroes"],
  queryFn: getAllSuperHero,
  select: (data) => {
    const superHeroNames = data.data.map((hero: Data) => hero.name);
    return superHeroNames;
  },
});

return (
  <div>
    {data.map((heroName: string, idx: number) => (
      <div key={`${heroName}-${idx}`}>{heroName}</div>
    ))}
  </div>
);
```

- **select**: (data: TData) => unknown
- select 옵션을 사용하여 쿼리 함수에서 반환된 데이터의 일부를 변환하거나 선택할 수 있다.
- 참고로, 반환된 데이터 값에는 영향을 주지만 쿼리 캐시에 저장되는 내용에는 영향을 주지 않는다.

### placeholderData

```javascript
const placeholderData = useMemo(() => generateFakeHeros(), []);

const {
  data,
  // ...
} = useQuery({
  queryKey: ["super-heroes"],
  queryFn: getAllSuperHero,
  placeholderData: placeholderData,
});
```

- **placeholderData**: TData | (previousValue: TData | undefined; previousQuery: Query | undefined,) => TData
- placeholderData를 설정하면 쿼리가 pending 상태인 동안 특정 쿼리에 대한 placeholder data로 사용된다.
- placeholderData는 캐시에 유지되지 않으며, 서버 데이터와 관계 없는 보여주기용 가짜 데이터다.
- placeholderData에 함수를 제공하는 경우 첫 번째 인자로 이전에 관찰된 쿼리 데이터를 수신하고, 두번째 인자는 이전 쿼리 인스턴스가 된다.
- placeholderData에 함수 활용 예시 코드

```javascript
import { useQuery } from "react-query";

// 가짜 데이터를 생성하는 함수
const generatePlaceholderData = (previousData) => {
  if (previousData) {
    // 이전 데이터가 있을 경우, 이를 변형하여 사용
    return previousData.map((hero) => ({
      ...hero,
      name: `${hero.name} (loading...)`,
    }));
  } else {
    // 기본 가짜 데이터 제공
    return [{ id: "placeholder", name: "Hero (loading...)" }];
  }
};

const Heroes = () => {
  const { data: heroes, isFetching } = useQuery({
    queryKey: ["heroes"],
    queryFn: fetchHeroes,
    placeholderData: (previousData) => generatePlaceholderData(previousData),
  });

  return (
    <div>
      {isFetching ? (
        <div>Loading...</div>
      ) : (
        heroes.map((hero) => <div key={hero.id}>{hero.name}</div>)
      )}
    </div>
  );
};
```

### keepPreviousData

- v4까지 있던 keepPreviousData은 페이지네이션과 같은 기능을 구현할 때 많이 사용하던 옵션이었다. 캐싱 되지 않은 페이지를 가져올 때 목록이 깜빡거리는 현상을 방지할 수 있다.
- **하지만, v5부터 keepPreviousData, isPreviousData은 옵션에서 제거됐다.**
  - [Removed keepPreviousData in favor of placeholderData identity function](https://github.com/ssi02014/react-query-tutorial/blob/main/document/v5.md#9-%EF%B8%8F-removed-keeppreviousdata-in-favor-of-placeholderdata-identity-function)
- 이들은 각각 placeholderData와 isPlaceholderData 플래그와 거의 거의 유사하게 동작하기 때문에 제거됐다.
- 아래 예제처럼 placeholderData를 활용하면서 이전 버전에서 keepPreviousData와 값을 "true"로 줬을 때와 동일한 기능을 수행할 수 있다.

```javascript
import { useQuery, keepPreviousData } from "@tanstack/react-query";

const {
  data,
  // ...
} = useQuery({
  queryKey: ["super-heroes"],
  queryFn: getAllSuperHero,
  placeholderData: keepPreviousData,
});
```

- 아래 예시처럼 작성해서 위 keepPreviousData 예시와 동일한 동작을 할 수 있다.

```javascript
import { useQuery } from "@tanstack/react-query";

const {
  data,
  // ...
} = useQuery({
  queryKey: ["super-heroes"],
  queryFn: getAllSuperHero,
  placeholderData: (previousData, previousQuery) => previousData,
});
```

### notifyOnChangeProps

```javascript
import { useQuery } from "@tanstack/react-query";

const { data, dataUpdatedAt } = useQuery({
  queryKey: ["super-heroes"],
  queryFn: getAllSuperHero,
  notifyOnChangeProps: ["data"], // data 값 변경시에만 리랜더링이 발생한다
});
```

- **notifyOnChangeProps**: string[] | "all" | (() => string[] | "all")
- 쿼리의 특정 프로퍼티들이 변경되었을 때만 리랜더링이 발생하도록 설정할 수 있다.
- 별도로 설정하지 않으면, 컴포넌트에 접근한 값이 변경되었을 때 리랜더링이 발생한다 (기본 동작). 즉 위 예시에서 notifyOnChangeProps에 설정 값을 주지 않았다면, data, dataUpdatedAt 중 어느 하나가 변경되면 리랜더링이 발생한다.
- "all"로 설정할 경우 쿼리의 어떤 프로퍼티가 변경되든 컴포넌트가 리랜더링된다.
- 참고: 기본 동작은 [Object.defineProperty()](https://github.com/TanStack/query/pull/1578/files#diff-93f379800fc8abf895eba249b2e2371eda98740aa40fc9f284a8088d190f46c3R506-R514)를 활용한다.

> notifyOnChangeProps는 어떤 상황에서 사용하면 좋을까?

1. **데이터가 변경되었을 때만 리랜더링이 필요한 경우** <br/>
   : 만약 컴포넌트가 쿼리로부터 반환된 데이터에만 의존하고 있고, 로딩 상태나 에러 상태의 변화에는 반응할 필요가 없다면, ["data"]만 지정하여 데이터가 실제로 변경될 때만 리랜더링되도록 할 수 있다.
2. **에러 핸들링에 집중해야할 경우** <br/>
   : 특정 쿼리가 실패했을 때 사용자에게 피드백을 제공하는 UI를 구현하는 경우, ["error"]를 지정하여 에러 상태의 변경에만 반응할 수 있다. 이는 데이터 로딩 중이거나 데이터가 성공적으로 로드된 경우에는 컴포넌트를 리랜더링하지 않음을 의미한다.
3. **로딩 상태의 변경을 기반으로 UI를 조정해야 할 경우** <br/>
   : 로딩 인디케이터나 로딩 메시지를 표시하고자 할 때, ["isLoading"]을 지정하여 로딩 상태의 변경에만 컴포넌트가 반응하도록 설정할 수 있다. 이렇게 하면 에러 상태의 변화는 무시하고 로딩 상태의 변화에만 집중할 수 있다.
4. **성능 최적화가 필요한 경우** <br/>
   대규모 데이터를 다루는 복잡한 대시보드나 애플리케이션에서는 불필요한 리랜더링을 최소화하는 것이 중요하다. notifyOnChangeProps를 활용하여 실제로 필요한 상태 변화에만 반응하도록 설정함으로써, 성능을 개선하고 사용자 경험을 향상시킬 수 있다.

```javascript
const { data, isLoading, error } = useQuery({
  queryKey: ["some-data"],
  queryFn: fetchData,
  notifyOnChangeProps: ["data", "error"], // 데이터 또는 에러 상태의 변화에만 반응
});
```

### Parallel

```javascript
const { data: superHeroes } = useQuery({
  queryKey: ["super-heroes"],
  queryFn: getAllSuperHero,
});
const { data: superHeroes } = useQuery({
  queryKey: ["friends"],
  queryFn: getFriends,
});
```

- 몇 가지 상황을 제외하면 쿼리 여러 개가 선언된 일반적인 상황일 때, 쿼리 함수들은 그냥 병렬로 요청돼서 처리된다.
- 이러한 특징은 쿼리 처리의 동시성을 극대화 시킨다.

```javascript
const queryResults = useQueries({
  queries: [
    {
      queryKey: ["super-hero", 1],
      queryFn: () => getSuperHero(1),
      staleTime: Infinity, // 다음과 같이 option 추가 가능!
    },
    {
      queryKey: ["super-hero", 2],
      queryFn: () => getSuperHero(2),
      staleTime: 0,
    },
    // ...
  ],
});
```

하지만 여러개의 쿼리를 동시에 수행해야 하는 경우, 렌더링이 거듭되어 사이사이에 계속 쿼리가 수행되어야 한다면 쿼리를 수행하는 로직이 hook 규칙에 어긋날 수도 있다. 이럴 때는 **useQuries**를 사용한다.

- useQuries 훅은 모든 쿼리 결과가 포함된 배열을 반환한다. 반환되는 순서는 쿼리가 입력된 순서와 동일하다

### Queries Combine

- **useQuries** 훅이 반환한 모든 쿼리 결과가 포한된 배열을 단일 값으로 결합하려면 combine 옵션을 사용할 수 있다.

```javascript
const ids = [1,2,3]
const combinedQueries = useQueries({
  queries: ids.map(id => (
    { queryKey: ['post', id], queryFn: () => fetchPost(id) },
  )),
  combine: (results) => {
    return ({
      data: results.map(result => result.data),
      pending: results.some(result => result.isPending),
    })
  }
})
```

- combinedQueries는 data와 pending 프로퍼티를 갖는다.
- 참고로 결합하면 쿼리 결과의 나머지 다른 프로퍼티들은 손실된다.

## Dependent Queries

: **Dependent Queries(종속 쿼리)** 는 어떤 A라는 쿼리가 있는데 이 A 쿼리를 실행하기 전에 사전에 완료되어야하는 B 쿼리가 있을 경우, B 쿼리에 의존하는 A 쿼리를 종속 쿼리라고 한다.

- react-query에서는 enabled 옵션을 통해 종속 쿼리를 쉽게 구현할 수 있다.

```javascript
// 사전에 완료되어야할 쿼리
const { data: user } = useQuery({
  queryKey: ["user", email],
  queryFn: () => getUserByEmail(email),
});

const channelId = user?.data.channelId;

// user 쿼리에 종속 쿼리
const { data: courses } = useQuery({
  queryKey: ["courses", channelId],
  queryFn: () => getCoursesByChannelId(channelId),
  enabled: !!channelId,
});
```

## useQueryClient

- useQueryClient는 QueryClient 인스턴스를 반환한다.
- QueryClient는 캐시와 상호작용한다.
- QueryClient는 다음 문서에 자세하게 나와있다.
  - [QueryClient](https://github.com/ssi02014/react-query-tutorial/tree/master/document/queryClient.md)

```javascript
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();
```

## QueryClient

- react-query에서 QueryClient의 인스턴스를 사용하여 캐시와 상호작용 할 수 있으며, 기본적인 사용법은 다음과 같다.

```javascript
// v4
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

// v3
import { QueryClient } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});
```

### Option

- queryCache?: QueryCache

  - Optional
  - 해당 queryClient 연결된 query 캐시이다.
  - 잘 쓰이지 않음

- mutationCache?: MutationCache

  - Optional
  - 해당 queryClient와 연결된 mutation cache이다.
  - 잘 쓰이지 않음

- logger?: Logger

  - v4
  - Optional
  - 해당 queryClient의 디버깅 정보, 경고 및 오류를 기록하는 데 사용하는 로거이다.
    설정하지 않으면 console 기본 로거이다.

- defaultOptions?: DefaultOptions
  - Optional
  - 모든 query 및 mutation에 대한 기본값을 정의한다.
  - 자주 쓰임!

### 자주 쓰이는 QueryClient 옵션

### 1. useQueryClient

- 일반적으로 QueryClient의 옵션들을 이용할 때는 현재 QueryClient의 인스턴스를 반환하는 useQueryClient Hook을 사용한다.

```javascript
// v3
import { useQueryClient } from "react-query";

const queryClient = useQueryClient();

// v4
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient({ context });
// context?: React.Context<QueryClient | undefined>
// 사용자 정의 React Query Context를 사용할 때 해당 옵션 사용함
```

### 2. getQueryData

- queryClient.getQueryData는 기존 쿼리의 캐시된 데이터를 가져오는 데 사용할 수 있는 동기 함수이다. 쿼리가 존재하지 않으면 undefined를 반환한다.

```javascript
// v3
const data = queryClient.getQueryData(queryKey);

// v4
const data = queryClient.getQueryData({ queryKey });
```

- 실제 예제

```javascript
const queryData = queryClient.getQueryData(["super-heroes"]);
```

- Type

```javascript
getQueryData<TQueryFnData = unknown>(queryKey: QueryKey, filters?: QueryFilters): TQueryFnData | undefined;
```

### 3. getQueriesData

- queryClient.getQueriesData는 여러 쿼리의 데이터를 가져오는데 사용할 수 있는 동기 함수이다. queryKey 또는 filters와 일치하는 쿼리만 반환한다. 일치하는 쿼리가 없으면 빈배열을 반환한다.
- [Query filters](https://tanstack.com/query/v4/docs/guides/filters#query-filters)

```javascript
// v3/v4
const data = queryClient.getQueriesData(queryKey | filters);
```

- v4에서는 v3 형태도 지원한다.

```javascript
// type
getQueriesData<TQueryFnData = unknown>(queryKey: QueryKey): [QueryKey, TQueryFnData | undefined][];
getQueriesData<TQueryFnData = unknown>(filters: QueryFilters): [QueryKey, TQueryFnData | undefined][];
```

### 4. setQueryData

- queryClient.setQueryData는 캐싱된 쿼리 데이터를 즉시 업데이트하는데 사용할 수 있는 동기 함수다.
- invalidateQueries와 더불어 캐시 데이터를 최신화할 때 많이 사용한다.

```javascript
// v3/v4
queryClient.setQueryData(["super-hero"], (oldData) => {
  return {
    ...oldData,
    data: [...oldData.data, data.data],
  };
});
```

- v4에서는 v3 형태도 지원한다.

```javascript
// type
setQueryData<TQueryFnData>(queryKey: QueryKey, updater: Updater<TQueryFnData | undefined, TQueryFnData | undefined>, options?: SetDataOptions): TQueryFnData | undefined;
```

### 5. setQueriesData

- queryClient.setQueriesData는 필터 기능을 사용하거나 쿼리 키를 부분적으로 일치시켜 여러 쿼리의 캐시된 데이터를 즉시 업데이트하는데 사용할 수 있는 동기 함수이다.
- 전달된 queryKey 또는 filters와 일치하는 쿼리만 업데이트되며, 새 캐시 항목이 생성되지 않는다.

```javascript
// v3/v4
queryClient.setQueriesData(["super-hero"], (oldData) => {
  return {
    ...oldData,
    data: [...oldData.data, data.data],
  };
});
```

- v4에서는 v3 형태도 지원한다.

```javascript
setQueriesData<TQueryFnData>(queryKey: QueryKey, updater: Updater<TQueryFnData | undefined, TQueryFnData | undefined>, options?: SetDataOptions): [QueryKey, TQueryFnData | undefined][];
setQueriesData<TQueryFnData>(filters: QueryFilters, updater: Updater<TQueryFnData | undefined, TQueryFnData | undefined>, options?: SetDataOptions): [QueryKey, TQueryFnData | undefined][];
```

### 6. invalidateQueries

- queryClient.invalidateQueries는 setQueryData와 더불어 캐시 데이터를 최신화할 때 많이 사용하는 함수이다.
- 단일 또는 여러 쿼리 데이터를 무효화하고([예제 링크](https://github.com/ssi02014/react-query-tutorial#%EC%BF%BC%EB%A6%AC-%EB%AC%B4%ED%9A%A8%ED%99%94)), 다시 가져오는데 많이 사용한다.
- 기본적으로 일치하는 모든 쿼리는 즉시 유효하지 않은 것으로 표시되고, 활성 쿼리는 백그라운드에서 다시 가져온다.
- 만약, 활성 쿼리를 다시 가져오는 것을 원하지 않으면 v3에서는 refetchActive: false, v4에서는 refetchType: 'none'을 사용할 수 있다.
- 반대로 비 활성화 쿼리를 다시 가져오기를 원한다면 v3에서는 refetchInactive: true, v4에서는 refetchType: 'all'을 사용할 수 있다.
- 참고로 query 옵션으로 enabled: false 옵션을 주면 queryClient가 쿼리를 가시 가져오는 방법들 중 invaildateQueries와 refetchQueries를 무시한다.

```javascript
// v3
await queryClient.invalidateQueries(
  ["super-heroes"],
  {
    exact,
    refetchActive: true,
    refetchInactive: false,
  },
  { throwOnError, cancelRefetch }
);

// v4
await queryClient.invalidateQueries(
  {
    queryKey: ["super-heroes"],
    exact,
    refetchType: "active",
  },
  { throwOnError, cancelRefetch }
);

// exact옵션을 줬기 때문에 쿼리 키와 정확히 일치하는 쿼리만을 무효화하고 다시 가져온다.
```

- 추가적으로 invalidateQueries가 무효화하는 쿼리 범위는 기본적으로 상위 -> 하위로 전파된다. 이게 무슨 말이냐면 아래와 같이 ['super-heros'] 쿼리를 무효화하게 되면 아래 하위 쿼리들도 모두 초기화된다.

```javascript
queryClient.invalidateQueries({
  queryKey: ["super-heroes"],
});

["super-heros"],
["super-heros", 'superman'],
["super-heros", { id: 1} ],
```

- 위와 같이 ['super-heros'] 쿼리를 무효화하게 되면 아래 하위 쿼리들도 모두 초기화된다.
- 하지만 해당 key만 무효화 시키려면 첫 번째 예제 코드에서도 언급했듯이 exact 옵션을 주면된다.

- v4에서는 v3 형태도 지원한다.

```javascript
// type
invalidateQueries<TPageData = unknown>(filters?: InvalidateQueryFilters<TPageData>, options?: InvalidateOptions): Promise<void>;
invalidateQueries<TPageData = unknown>(queryKey?: QueryKey, filters?: InvalidateQueryFilters<TPageData>, options?: InvalidateOptions): Promise<void>;
```

### 7. refetchQueries

[정리 여기부터](https://github.com/ssi02014/react-query-tutorial/blob/main/document/queryClient.md#refetchqueries)
