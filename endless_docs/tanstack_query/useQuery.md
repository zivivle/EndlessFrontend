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
