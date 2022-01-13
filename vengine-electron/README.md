## build 사용법

1. package.json (라이브)
2. package-dev.json (개발)
3. env.production (개발 / 라이브 : 아이피 변경해서 적용 :::: 웹 빌드로 인해 아이피가 변경될 수 있음)
4. 개발 버전 빌드 시
   package.json 이름을 임의로 변경 후 package-dev.json 을 package.json 으로 변경
   version 변경, version.html 파일에도 버전 변경

## STACK

-   [REACT](https://reactjs.org/)
-   [REDUX](https://redux.js.org/)
-   [REDUX-SAGA](https://redux-saga.js.org/)
-   [REDUX-ACTIONS](https://redux.js.org/basics/actions)
-   [REACCT_ROUTER_GUARDS](https://www.npmjs.com/package/react-router-guards)
-   [PRIMEREACT](https://primefaces.org/primereact/showcase/#/)
-   [ANTDESIGN](https://ant.design/)
-   [AXIOS](https://www.npmjs.com/package/axios)
-   [REACT-COLLAPSE-PANE](https://collapse-pane.zurg.dev/#/?id=react-collapse-pane)

## Directory

-   components -> Ui Components & Containers( Common Components )
-   core -> Custom Hooks & Utils
-   pages -> Route Page
-   store -> Redux ducks pattern( Action, Action type, Reducer Set ) & Sagas
-   style -> Ui styles

## Flow

1. store에서 해당 기능 폴더 생성
2. 해당 기능 폴더에서 index, reducer, saga 생성
3. reducer 파일에서 action, action type, redux 작성
4. saga 파일 생성 후 reducer에서 작성한 action, action type를 import.
5. 기능의 api와 해당 action type을 묶어 준 후 제네레이터 함수에 작성
6. 해당 컴포넌트에서 useSelector를 사용하여 redux와 연결, useDispatch을 사용하면 action을 dispatch

## Quick Start

```shell
$ git clone https://github.com/r-park/soundcloud-redux.git
$ cd vengin-electron
$ npm install
$ npm start
```

## NPM Commands

| Command       | Description                                           |
| ------------- | ----------------------------------------------------- |
| npm start     | Start webpack electron server @ **localhost:3000**    |
| npm run dev   | Start webpack development server @ **localhost:3000** |
| npm run build | Build production bundles to **./target** directory    |
