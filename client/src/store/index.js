import { createContext, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import jsTPS from "../common/jsTPS";
import api from "./store-request-api";
import CreateSong_Transaction from "../transactions/CreateSong_Transaction";
import MoveSong_Transaction from "../transactions/MoveSong_Transaction";
import RemoveSong_Transaction from "../transactions/RemoveSong_Transaction";
import UpdateSong_Transaction from "../transactions/UpdateSong_Transaction";
import AuthContext from "../auth";
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
// console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
  CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
  CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
  CREATE_NEW_LIST: "CREATE_NEW_LIST",
  LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
  MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
  SET_CURRENT_LIST: "SET_CURRENT_LIST",
  SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
  EDIT_SONG: "EDIT_SONG",
  REMOVE_SONG: "REMOVE_SONG",
  HIDE_MODALS: "HIDE_MODALS",
  SET_SORT: "SET_SORT",
  SET_VIEW: "SET_VIEW",
  SET_SEARCH: "SET_SEARCH",
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
  NONE: "NONE",
  DELETE_LIST: "DELETE_LIST",
  EDIT_SONG: "EDIT_SONG",
  REMOVE_SONG: "REMOVE_SONG",
};
const CurrentView = {
  HOME: "HOME",
  ALL: "ALL",
  USER: "USER",
};
const CurrentSort = {
  NAME: "NAME",
  DATE: "DATE",
  LISTENS: "LISTENS",
  LIKES: "LIKES",
  DISLIKES: "DISLIKES",
  CREATE: "CREATE",
  EDIT: "EDIT",
};

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
  // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
  const { auth } = useContext(AuthContext);

  let initView = CurrentView.HOME;
  if (auth.user == null) {
    initView = CurrentView.ALL;
  }

  const [store, setStore] = useState({
    currentModal: CurrentModal.NONE,
    idNamePairs: [],
    currentList: null,
    currentSongIndex: -1,
    currentSong: null,
    newListCounter: 0,
    listNameActive: false,
    listIdMarkedForDeletion: null,
    listMarkedForDeletion: null,
    currentSort: CurrentSort.NAME,
    currentView: initView,
    searchText: "",
    guestModal: false,
    playingList: null,
    mylist: null,
    prevLogin: null,
    currentlyPlaying: null,
    error: null,
  });
  const history = useHistory();

  // console.log("inside useGlobalStore");

  // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
  // console.log("auth: " + auth);

  // HERE'S THE DATA STORE'S REDUCER, IT MUST
  // HANDLE EVERY TYPE OF STATE CHANGE
  const storeReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      // LIST UPDATE OF ITS NAME
      case GlobalStoreActionType.CHANGE_LIST_NAME: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: payload.idNamePairs,
          currentList: payload.playlist,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          currentSort: store.currentSort,
          currentView: store.currentView,
          searchText: store.searchText,
          guestModal: store.guestModal,
          playingList: store.playingList,
          mylist: store.mylist,
          prevLogin: store.prevLogin,
          currentlyPlaying: store.currentlyPlaying,
          error: store.error,
        });
      }
      // STOP EDITING THE CURRENT LIST
      case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          currentSort: store.currentSort,
          currentView: store.currentView,
          searchText: store.searchText,
          guestModal: store.guestModal,
          playingList: store.playingList,
          mylist: store.mylist,
          prevLogin: store.prevLogin,
          currentlyPlaying: store.currentlyPlaying,
          error: store.error,
        });
      }
      // CREATE A NEW LIST
      case GlobalStoreActionType.CREATE_NEW_LIST: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter + 1,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          currentSort: store.currentSort,
          currentView: store.currentView,
          searchText: store.searchText,
          guestModal: store.guestModal,
          playingList: store.playingList,
          mylist: store.mylist,
          prevLogin: store.prevLogin,
          currentlyPlaying: store.currentlyPlaying,
          error: store.error,
        });
      }
      // GET ALL THE LISTS SO WE CAN PRESENT THEM
      case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: payload.pairs,
          currentList: store.currentList,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          currentSort: payload.sort,
          currentView: payload.view,
          searchText: payload.search,
          guestModal: store.guestModal,
          playingList: store.playingList,
          mylist: payload.mylist,
          prevLogin: auth.user,
          currentlyPlaying: store.currentlyPlaying,
          error: store.error,
        });
      }
      // PREPARE TO DELETE A LIST
      case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
        return setStore({
          currentModal: CurrentModal.DELETE_LIST,
          idNamePairs: store.idNamePairs,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: payload.id,
          listMarkedForDeletion: payload.playlist,
          currentSort: store.currentSort,
          currentView: store.currentView,
          searchText: store.searchText,
          guestModal: store.guestModal,
          playingList: store.playingList,
          mylist: store.mylist,
          prevLogin: store.prevLogin,
          currentlyPlaying: store.currentlyPlaying,
          error: store.error,
        });
      }
      // UPDATE A LIST
      case GlobalStoreActionType.SET_CURRENT_LIST: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          currentSort: store.currentSort,
          currentView: store.currentView,
          searchText: store.searchText,
          guestModal: store.guestModal,
          playingList: store.playingList,
          mylist: store.mylist,
          prevLogin: store.prevLogin,
          currentlyPlaying: store.currentlyPlaying,
          error: store.error,
        });
      }
      // UPDATE A LIST
      case GlobalStoreActionType.SET_PLAYING_LIST: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          currentSort: store.currentSort,
          currentView: store.currentView,
          searchText: store.searchText,
          guestModal: store.guestModal,
          playingList: payload,
          mylist: store.mylist,
          prevLogin: store.prevLogin,
          currentlyPlaying: store.currentlyPlaying,
          error: store.error,
        });
      }
      // START EDITING A LIST NAME
      case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: true,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          currentSort: store.currentSort,
          currentView: store.currentView,
          searchText: store.searchText,
          guestModal: store.guestModal,
          playingList: store.playingList,
          mylist: store.mylist,
          prevLogin: store.prevLogin,
          currentlyPlaying: store.currentlyPlaying,
          error: store.error,
        });
      }
      //
      case GlobalStoreActionType.EDIT_SONG: {
        return setStore({
          currentModal: CurrentModal.EDIT_SONG,
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          currentSongIndex: payload.currentSongIndex,
          currentSong: payload.currentSong,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          currentSort: store.currentSort,
          currentView: store.currentView,
          searchText: store.searchText,
          guestModal: store.guestModal,
          playingList: store.playingList,
          mylist: store.mylist,
          prevLogin: store.prevLogin,
          currentlyPlaying: store.currentlyPlaying,
          error: store.error,
        });
      }
      case GlobalStoreActionType.REMOVE_SONG: {
        return setStore({
          currentModal: CurrentModal.REMOVE_SONG,
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          currentSongIndex: payload.currentSongIndex,
          currentSong: payload.currentSong,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          currentSort: store.currentSort,
          currentView: store.currentView,
          searchText: store.searchText,
          guestModal: store.guestModal,
          playingList: store.playingList,
          mylist: store.mylist,
          prevLogin: store.prevLogin,
          currentlyPlaying: store.currentlyPlaying,
          error: store.error,
        });
      }
      case GlobalStoreActionType.HIDE_MODALS: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          currentSort: store.currentSort,
          currentView: store.currentView,
          searchText: store.searchText,
          guestModal: store.guestModal,
          playingList: store.playingList,
          mylist: store.mylist,
          prevLogin: store.prevLogin,
          currentlyPlaying: store.currentlyPlaying,
          error: store.error,
        });
      }
      case GlobalStoreActionType.SET_SORT: {
        return setStore({
          ...store,
          idNamePairs: payload.pairs,
          currentSort: payload.sort,
        });
      }
      case GlobalStoreActionType.SET_VIEW: {
        // console.log(payload);
        return setStore({
          ...store,
          currentView: payload.view,
        });
      }
      case GlobalStoreActionType.SET_SEARCH: {
        // console.log(payload);
        return setStore({
          ...store,
          idNamePairs: store.idNamePairs,
          searchText: payload,
        });
      }
      default:
        return store;
    }
  };

  store.setError = (x) => {
    setStore({
      ...store,
      error: x,
    });
  };

  store.setCurrentlyPlaying = (index) => {
    setStore({
      ...store,
      currentlyPlaying: index,
    });
  };

  store.toggleGuestModal = () => {
    setStore({
      ...store,
      guestModal: !store.guestModal,
    });
  };
  store.setSearchText = (text) => {
    console.log(store.idNamePairs);
    setStore({
      ...store,
      searchText: text,
    });
  };
  store.searchUser = (user) => {
    console.log(store.idNamePairs);
    setStore({
      ...store,
      currentView: CurrentView.USER,
      searchText: user,
    });
  };

  store.setView = (view) => {
    console.log("setView");
    async function asyncLoadIdNamePairs() {
      const response = await api.getPlaylistPairs(view);
      if (response.data.success) {
        let pairsArray = response.data.idNamePairs;

        store.doSort(pairsArray, view, CurrentSort.NAME);
        // storeReducer({
        //   type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
        //   payload: pairsArray,
        // });
      } else {
        console.log("API FAILED TO GET THE LIST PAIRS");
      }
    }
    asyncLoadIdNamePairs();
  };

  // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
  // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
  // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.
  store.doSort = (pairsArray, view, givenSort) => {
    console.log("do sort");
    let sortedIdNamePairs = pairsArray;
    let sortType;
    let sort = store.currentSort;
    if (givenSort) {
      sort = givenSort;
    }
    if (sort === CurrentSort.NAME) {
      sortedIdNamePairs = pairsArray.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      sortType = CurrentSort.NAME;
    } else if (sort === CurrentSort.DATE) {
      sortedIdNamePairs = pairsArray.sort((a, b) =>
        a.publishDate > b.publishDate ? -1 : 1
      );
      sortType = CurrentSort.DATE;
    } else if (sort === CurrentSort.LISTENS) {
      sortedIdNamePairs = pairsArray.sort((a, b) =>
        a.listens > b.listens ? -1 : 1
      );
      sortType = CurrentSort.LISTENS;
    } else if (sort === CurrentSort.LIKES) {
      sortedIdNamePairs = pairsArray.sort((a, b) =>
        a.likes > b.likes ? -1 : 1
      );
      sortType = CurrentSort.LIKES;
    } else if (sort === CurrentSort.DISLIKES) {
      sortedIdNamePairs = pairsArray.sort((a, b) =>
        a.dislikes > b.dislikes ? -1 : 1
      );
      sortType = CurrentSort.DISLIKES;
    } else if (sort === CurrentSort.CREATE) {
      sortedIdNamePairs = pairsArray.sort((a, b) =>
        a.createdAt > b.createdAt ? 1 : -1
      );
      sortType = CurrentSort.CREATE;
    } else if (sort === CurrentSort.EDIT) {
      sortedIdNamePairs = pairsArray.sort((a, b) =>
        a.updatedAt > b.updatedAt ? -1 : 1
      );
      sortType = CurrentSort.EDIT;
    }
    // console.log(sortedIdNamePairs);
    if (view == "HOME") {
      storeReducer({
        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
        payload: {
          pairs: sortedIdNamePairs,
          view: view,
          sort: sortType,
          mylist: sortedIdNamePairs,
          search: view != store.currentView ? "" : store.searchText,
        },
      });
    } else {
      storeReducer({
        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
        payload: {
          pairs: sortedIdNamePairs,
          view: view,
          sort: sortType,
          mylist: store.mylist,
          search: view != store.currentView ? "" : store.searchText,
        },
      });
    }
  };
  store.setSort = (sort) => {
    let sortedIdNamePairs = store.idNamePairs;
    let sortType;
    if (sort === CurrentSort.NAME) {
      sortedIdNamePairs = store.idNamePairs.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      sortType = CurrentSort.NAME;
    } else if (sort === CurrentSort.DATE) {
      sortedIdNamePairs = store.idNamePairs.sort((a, b) =>
        a.publishDate > b.publishDate ? -1 : 1
      );
      sortType = CurrentSort.DATE;
    } else if (sort === CurrentSort.LISTENS) {
      sortedIdNamePairs = store.idNamePairs.sort((a, b) =>
        a.listens > b.listens ? -1 : 1
      );
      sortType = CurrentSort.LISTENS;
    } else if (sort === CurrentSort.LIKES) {
      sortedIdNamePairs = store.idNamePairs.sort((a, b) =>
        a.likes > b.likes ? -1 : 1
      );
      sortType = CurrentSort.LIKES;
    } else if (sort === CurrentSort.DISLIKES) {
      sortedIdNamePairs = store.idNamePairs.sort((a, b) =>
        a.dislikes > b.dislikes ? -1 : 1
      );
      sortType = CurrentSort.DISLIKES;
    } else if (sort === CurrentSort.CREATE) {
      sortedIdNamePairs = store.idNamePairs.sort((a, b) =>
        a.createdAt > b.createdAt ? 1 : -1
      );
      sortType = CurrentSort.CREATE;
    } else if (sort === CurrentSort.EDIT) {
      sortedIdNamePairs = store.idNamePairs.sort((a, b) =>
        a.updatedAt > b.updatedAt ? -1 : 1
      );
      sortType = CurrentSort.EDIT;
    }
    // console.log(sortedIdNamePairs);
    storeReducer({
      type: GlobalStoreActionType.SET_SORT,
      payload: { sort: sortType, pairs: sortedIdNamePairs },
    });
  };

  // THIS FUNCTION PROCESSES CHANGING A LIST NAME
  store.changeListName = function (id, newName) {
    // GET THE LIST
    async function asyncChangeListName(id) {
      let response = await api.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        playlist.name = newName;
        async function updateList(playlist) {
          response = await api.updatePlaylistById(playlist._id, playlist);
          if (response.data.success) {
            async function getListPairs(playlist) {
              response = await api.getPlaylistPairs(store.currentView);
              if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                  type: GlobalStoreActionType.CHANGE_LIST_NAME,
                  payload: {
                    idNamePairs: pairsArray,
                    playlist: playlist,
                  },
                });
              }
            }
            getListPairs(playlist);
          }
        }
        updateList(playlist);
      }
    }
    asyncChangeListName(id);
  };

  // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
  store.closeCurrentList = function () {
    storeReducer({
      type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
      payload: {},
    });
    tps.clearAllTransactions();
    // history.push("/");
  };

  // THIS FUNCTION CREATES A NEW LIST
  store.createNewList = async function () {
    console.log("newList");
    let ogName = "Untitled";
    let newName = ogName;
    let names = store.idNamePairs.map((x) => x.name);
    let counter = 0;
    while (names.includes(newName)) {
      newName = ogName + " (" + counter + ")";
      counter++;
    }
    counter = 0;
    let newListName = newName;
    const response = await api.createPlaylist(
      newListName,
      [],
      auth.user.email,
      auth.user
    );
    console.log("createNewList response: " + response);
    if (response.status === 201) {
      tps.clearAllTransactions();
      let newList = response.data.playlist;
      storeReducer({
        type: GlobalStoreActionType.CREATE_NEW_LIST,
        payload: newList,
      });
      store.loadIdNamePairs();
      // IF IT'S A VALID LIST THEN LET'S START EDITING IT
      // history.push("/playlist/" + newList._id);
    } else {
      console.log("API FAILED TO CREATE A NEW LIST");
    }
  };
  store.duplicateList = async function () {
    console.log("dup list");
    let ogName = store.currentList.name;
    let newName = store.currentList.name;
    let names = store.mylist.map((x) => x.name);
    let counter = 0;
    while (names.includes(newName)) {
      newName = ogName + " (" + counter + ")";
      counter++;
    }
    counter = 0;
    const response = await api.createPlaylist(
      newName,
      store.currentList.songs,
      auth.user.email,
      auth.user
    );
    console.log("duplicate response: " + response);
    if (response.status === 201) {
      tps.clearAllTransactions();
      let newList = response.data.playlist;
      // console.log(newList);
      // storeReducer({
      //   type: GlobalStoreActionType.CREATE_NEW_LIST,
      //   payload: newList,
      // });
      store.loadIdNamePairs();
      // IF IT'S A VALID LIST THEN LET'S START EDITING IT
      // history.push("/playlist/" + newList._id);
    } else {
      console.log("API FAILED TO CREATE A NEW LIST");
    }
  };

  // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
  store.loadIdNamePairs = function () {
    console.log("loadPairs");
    async function asyncLoadIdNamePairs() {
      let view = store.currentView;
      if (store.prevLogin != auth.user) {
        if (auth.user) {
          view = CurrentView.HOME;
        } else {
          view = CurrentView.ALL;
        }
      }
      const response = await api.getPlaylistPairs(view);
      if (response.data.success) {
        let pairsArray = response.data.idNamePairs;

        store.doSort(pairsArray, view);
        // storeReducer({
        //   type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
        //   payload: pairsArray,
        // });
      } else {
        console.log("API FAILED TO GET THE LIST PAIRS");
      }
    }
    asyncLoadIdNamePairs();
  };

  // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
  // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
  // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
  // showDeleteListModal, and hideDeleteListModal
  store.markListForDeletion = function (id) {
    async function getListToDelete(id) {
      let response = await api.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        storeReducer({
          type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
          payload: { id: id, playlist: playlist },
        });
      }
    }
    getListToDelete(id);
  };
  store.deleteList = function (id) {
    async function processDelete(id) {
      let response = await api.deletePlaylistById(id);
      if (response.data.success) {
        store.loadIdNamePairs();
        history.push("/");
      }
    }
    processDelete(id);
  };
  store.deleteMarkedList = function () {
    store.deleteList(store.listIdMarkedForDeletion);
    store.hideModals();
  };
  // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
  // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

  store.showEditSongModal = (songIndex, songToEdit) => {
    storeReducer({
      type: GlobalStoreActionType.EDIT_SONG,
      payload: { currentSongIndex: songIndex, currentSong: songToEdit },
    });
  };
  store.showRemoveSongModal = (songIndex, songToRemove) => {
    storeReducer({
      type: GlobalStoreActionType.REMOVE_SONG,
      payload: { currentSongIndex: songIndex, currentSong: songToRemove },
    });
    console.log("showRemoveSongModal");
  };
  store.hideModals = () => {
    storeReducer({
      type: GlobalStoreActionType.HIDE_MODALS,
      payload: {},
    });
  };
  store.isDeleteListModalOpen = () => {
    return store.currentModal === CurrentModal.DELETE_LIST;
  };
  store.isEditSongModalOpen = () => {
    return store.currentModal === CurrentModal.EDIT_SONG;
  };
  store.isRemoveSongModalOpen = () => {
    return store.currentModal === CurrentModal.REMOVE_SONG;
  };

  // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
  // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
  // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
  // moveItem, updateItem, updateCurrentList, undo, and redo
  store.setCurrentList = function (id) {
    async function asyncSetCurrentList(id) {
      let response = await api.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;

        response = await api.updatePlaylistById(playlist._id, playlist);
        if (response.data.success) {
          storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: playlist,
          });
          // store.loadIdNamePairs();
          // history.push("/playlist/" + playlist._id);
        }
      }
    }
    asyncSetCurrentList(id);
  };

  store.setPlayingList = function (id) {
    async function asyncSetPlayingList(id) {
      let response = await api.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        if (playlist.published) playlist.listens += 1;

        response = await api.updatePlaylistById(playlist._id, playlist);
        if (response.data.success) {
          storeReducer({
            type: GlobalStoreActionType.SET_PLAYING_LIST,
            payload: playlist,
          });
          // store.loadIdNamePairs();
          // history.push("/playlist/" + playlist._id);
        }
      }
    }
    asyncSetPlayingList(id);
  };

  store.getPlaylistSize = function () {
    return store.currentList.songs.length;
  };
  store.addNewSong = function () {
    let index = this.getPlaylistSize();
    this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
  };
  // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
  // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
  store.createSong = function (index, song) {
    let list = store.currentList;
    list.songs.splice(index, 0, song);
    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
  // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
  store.moveSong = function (start, end) {
    let list = store.currentList;

    // WE NEED TO UPDATE THE STATE FOR THE APP
    if (start < end) {
      let temp = list.songs[start];
      for (let i = start; i < end; i++) {
        list.songs[i] = list.songs[i + 1];
      }
      list.songs[end] = temp;
    } else if (start > end) {
      let temp = list.songs[start];
      for (let i = start; i > end; i--) {
        list.songs[i] = list.songs[i - 1];
      }
      list.songs[end] = temp;
    }

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
  // FROM THE CURRENT LIST
  store.removeSong = function (index) {
    let list = store.currentList;
    list.songs.splice(index, 1);

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
  store.updateSong = function (index, songData) {
    let list = store.currentList;
    let song = list.songs[index];
    song.title = songData.title;
    song.artist = songData.artist;
    song.youTubeId = songData.youTubeId;

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  store.addNewSong = () => {
    let playlistSize = store.getPlaylistSize();
    store.addCreateSongTransaction(
      playlistSize,
      "Untitled",
      "?",
      "dQw4w9WgXcQ"
    );
  };
  // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
  store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
    // ADD A SONG ITEM AND ITS NUMBER
    let song = {
      title: title,
      artist: artist,
      youTubeId: youTubeId,
    };
    let transaction = new CreateSong_Transaction(store, index, song);
    tps.addTransaction(transaction);
  };
  store.addMoveSongTransaction = function (start, end) {
    let transaction = new MoveSong_Transaction(store, start, end);
    tps.addTransaction(transaction);
  };
  // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
  store.addRemoveSongTransaction = () => {
    let index = store.currentSongIndex;
    let song = store.currentList.songs[index];
    let transaction = new RemoveSong_Transaction(store, index, song);
    tps.addTransaction(transaction);
  };
  store.addUpdateSongTransaction = function (index, newSongData) {
    let song = store.currentList.songs[index];
    let oldSongData = {
      title: song.title,
      artist: song.artist,
      youTubeId: song.youTubeId,
    };
    let transaction = new UpdateSong_Transaction(
      this,
      index,
      oldSongData,
      newSongData
    );
    tps.addTransaction(transaction);
  };

  store.updateCurrentList = function () {
    async function asyncUpdateCurrentList() {
      const response = await api.updatePlaylistById(
        store.currentList._id,
        store.currentList
      );
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: store.currentList,
        });
      }
    }
    asyncUpdateCurrentList();
  };
  store.likeList = function (id) {
    async function asyncUpdateList() {
      const response = await api.updatePlaylistById(id, { like: true });
      if (response.data.success) {
        console.log("liked");
        store.loadIdNamePairs();
      }
    }
    asyncUpdateList();
  };
  store.dislikeList = function (id) {
    async function asyncUpdateList() {
      const response = await api.updatePlaylistById(id, { dislike: true });
      if (response.data.success) {
        console.log("liked");
        store.loadIdNamePairs();
      }
    }
    asyncUpdateList();
  };
  store.comment = function (comment) {
    async function asyncUpdateList() {
      const response = await api.updatePlaylistById(store.playingList._id, {
        newComment: {
          text: comment,
          owner: auth.user.username,
        },
      });
      if (response.data.success) {
        console.log("liked");
        store.setPlayingList(store.playingList._id);
      }
    }
    asyncUpdateList();
  };

  store.publishList = function () {
    async function asyncUpdateCurrentList() {
      store.currentList.published = true;
      store.currentList.likes = 0;
      store.currentList.dislikes = 0;
      store.currentList.listens = 0;
      store.currentList.comments = [];
      const currentDate = new Date();
      store.currentList.publishDate = currentDate.getTime();
      const response = await api.updatePlaylistById(
        store.currentList._id,
        store.currentList
      );
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: store.currentList,
        });
        store.loadIdNamePairs();
      }
    }
    asyncUpdateCurrentList();
  };

  store.undo = function () {
    tps.undoTransaction();
  };
  store.redo = function () {
    tps.doTransaction();
  };
  store.canAddNewSong = function () {
    return store.currentList !== null;
  };
  store.canUndo = function () {
    return store.currentList !== null && tps.hasTransactionToUndo();
  };
  store.canRedo = function () {
    return store.currentList !== null && tps.hasTransactionToRedo();
  };
  store.canClose = function () {
    return store.currentList !== null;
  };

  // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
  store.setIsListNameEditActive = function () {
    storeReducer({
      type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
      payload: null,
    });
  };

  return (
    <GlobalStoreContext.Provider
      value={{
        store,
      }}
    >
      {props.children}
    </GlobalStoreContext.Provider>
  );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
