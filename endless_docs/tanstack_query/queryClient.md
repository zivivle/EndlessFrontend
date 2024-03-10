## queryClient

### refetchQueries

- queryClient.refetchQueries는 특정 조건에 따라 쿼리를 다시 가져오는 데 사용하는 함수이다.
- 참고로 query 옵션으로 enabled: false 옵션을 주면 queryClient가 쿼리를 다시 가져오는 방법들 중 invalidateQueries와 refetchQueries를 무시한다.

```javascript
//[v3 버전]
// 모든 쿼리를 다시 가져온다
await queryClient.refetchQueries();

// 모든 stale 상태의 쿼리를 다시 가져온다.
await queryClient.refetchQueries({ stale: true });

// 쿼리 키와 부분적으로 일치하는 모든 활성 쿼리를 다시 가져온다.
await queryClient.refetchQueries(["super-heroes"], { active: true });

// exact 옵션을 줬기 때문에 쿼리 키와 정확히 일치하는 모든 활성 쿼리를 다시 가져온다.
await queryClient.refetchQueries(["super-heroes", 1], {
  active: true,
  exact: true,
});
```

```javascript
// 모든 쿼리를 다시 가져온다
await queryClient.refetchQueries();

// 모든 stale 상태의 쿼리를 다시 가져온다.
await queryClient.refetchQueries({ stale: true });

// 쿼리 키와 부분적으로 일치하는 모든 활성 쿼리를 다시 가져온다.
await queryClient.refetchQueries({
  queryKey: ["super-heroes"],
  type: "active",
});

// exact 옵션을 줬기 때문에 쿼리 키와 정확히 일치하는 모든 활성 쿼리를 다시 가져온다.
await queryClient.refetchQueries({
  queryKey: ["super-heroes", 1],
  type: "active",
  exact: true,
});

await queryClient.refetchQueries(
  {
    queryKey: ["super-heroes", 1],
    type: "active",
    exact: true,
  },
  { throwOnError, cancelRefetch }
);
```

**- v4에서는 v3형태도 지원한다.**

```javascript
// type
refetchQueries<TPageData = unknown>(filters?: RefetchQueryFilters<TPageData>, options?: RefetchOptions): Promise<void>;
refetchQueries<TPageData = unknown>(queryKey?: QueryKey, filters?: RefetchQueryFilters<TPageData>, options?: RefetchOptions): Promise<void>;
```

### cancelQueries

- queryClient.cancelQueries는 나가고 있는 액세스 가능한 쿼리를 수동적으로 취소시킬 수 있는 함수이다.
- 해당 함수는 나가고 있는 쿼리를 수동으로 삭제할 수 있기 때문에 낙관적 업데이트를 수행할 때 많이 사용된다.

```javascript
// v3
await queryClient.cancelQueries(["super-heroes"], { exact: true });

// v4
await queryClient.cancelQueries({ queryKey: ["super-heroes"], exact: true });
```

**cancelQueries는 사용자가 액션을 취소하거나 다른 페이지로 이동하는 등의 상황에서 진행 중인 쿼리를 취소하는 데 사용될 수 있고 특히 낙관적 업데이트시 사용될 수 있다.**

```javascript
import { useQuery, useQueryClient } from "react-query";

function useOptimisticUpdateExample() {
  const queryClient = useQueryClient();

  // 특정 데이터를 가져오는 쿼리
  const { data } = useQuery(["super-heroes"], fetchSuperHeroes);

  const updateHero = async (hero) => {
    // 쿼리 취소 함수를 호출하여 진행 중인 'super-heroes' 쿼리를 취소
    await queryClient.cancelQueries({
      queryKey: ["super-heroes"],
      exact: true,
    });

    // 낙관적 업데이트를 수행하기 전의 데이터를 백업
    const previousHeroes = queryClient.getQueryData(["super-heroes"]);

    // 낙관적 업데이트를 적용하여 UI를 빠르게 변경
    queryClient.setQueryData(["super-heroes"], (old) => [...old, hero]);

    try {
      // 실제 데이터 업데이트를 위한 API 요청
      await updateHeroAPI(hero);
    } catch (error) {
      // 에러가 발생했다면 이전 데이터로 롤백
      queryClient.setQueryData(["super-heroes"], previousHeroes);
      throw error;
    }
  };

  return { data, updateHero };
}
```

#### cancelQueries의 구체적인 사용 사례

1. 사용자 액션에 따른 취소
   : 사용자가 폼을 제출하고, 다른 페이지로 이동하기 전에 제출 과정이 완료되지 않았다면, 진행 중인 쿼리를 취소할 수 있다.

```javascript
import { useQueryClient } from "react-query";

function CancelButton() {
  const queryClient = useQueryClient();

  const cancelLoading = () => {
    queryClient.cancelQueries({ queryKey: ["fetch-data"], exact: true });
  };

  return <button onClick={cancelLoading}>Cancel Loading</button>;
}
```

2. 컴포넌트 언마운트 시 쿼리 취소
   : 사용자가 어떤 작업을 시작했으나 중간에 다른 페이지로 이동하는 경우, 시작된 작업이 더 이상 필요하지 않을 수 있다. 이때, "cancelQueries"를 사용해 불필요한 네트워크 요청을 줄일 수 있다.

```javascript
import { useEffect } from "react";
import { useQueryClient } from "react-query";

function MyComponent() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // 컴포넌트 마운트 시 실행되는 로직...

    return () => {
      // 컴포넌트가 언마운트되는 시점에 진행 중인 'fetch-data' 쿼리를 취소
      queryClient.cancelQueries({ queryKey: ["fetch-data"], exact: true });
    };
  }, [queryClient]);

  // 컴포넌트의 나머지 부분...
}
```

3. 낙관적 업데이트 중단: 사용자가 데이터를 수정하는 동안 네트워크 오류나 다른 이유로 인해 업데이트가 실패할 경우, "cancleQueries" 함수를 적절히 사용하면, 불필요한 데이터 요청을 줄이고, 사용자 인터페이스의 반응성을 개선할 수 있다.

```javascript
import { useQueryClient, useMutation } from "react-query";

const updateData = async (newData) => {
  // 데이터 업데이트 로직...
};

function useOptimisticUpdate() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(updateData, {
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["data"], exact: true });

      const previousData = queryClient.getQueryData(["data"]);
      queryClient.setQueryData(["data"], (oldData) => ({
        ...oldData,
        ...newData,
      }));

      return { previousData };
    },
    onError: (error, newData, context) => {
      queryClient.setQueryData(["data"], context.previousData);
    },
    // onSettled 등의 다른 옵션...
  });

  return mutate;
}
```
