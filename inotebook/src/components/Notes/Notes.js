import React, { useEffect, useState,useContext } from "react";
import ToastComponent from "../common/controls/newtoast";
import { FetchAllNotes, FetchCategory, FetchNotesByCategory, RemoveNote, SaveNotes } from "./notes_methods";
import { formatDistanceToNow } from "date-fns";
import "./Notes.css";
import { useNavigate } from "react-router-dom";
import CustomTinyMCEEditor from "../common/controls/quill-editor/quill-editor";
import _authContext from "../../context/authContext";


export default function Notes() {
  const [editorHtml, setEditorHtml] = useState('');
 const { isAuthenticated,logout } = useContext(_authContext);

 //Pagination

 const [totalRecord, SettotalRecord] = useState(0);
  const [RecordCount, SetRecordCount] = useState(2);
 let [PageNo, SetPageNo] = useState(1);

 const HandleNext=()=>{
  PageNo=PageNo+1;
  SetPageNo(PageNo);
  //alert(PageNo);
  HandleCategoryClick('','mainid0');
 }

 const HandlePrev=()=>{
  SetPageNo(PageNo ==1 ? 1 :PageNo-1);
  HandleCategoryClick('','mainid0');
 }

 const navigate = useNavigate();
  const _handleChange = (html) => {
    setEditorHtml(html);
  };


  const handleEditorChange=(value)=>{
    handleChange('content',value);
  }


  const [Form_Or_List, setFormOrList] = useState(false);
  const [activeIndex, setActiveIndex] = useState('mainid0');
  const [Action, setAction] = useState("");
  const [ShowLoading, SetLoading] = useState(true);
  const [ShowNoRecord, SetNoRecord] = useState(false);

  const [CategoryList, SetCategoryList] = useState([]);
  const [NotesList, SetNotesList] = useState([]);

  const [Message, SetMessage] = useState({ message: "", type: "" });
  const [showToast, setShowToast] = useState(false);

  const [SelCategory, handleSelectChange] = useState("-1");
  const [NotesModel, SetNotesModel] = useState({
    title: "",
    category: "",
    content: "",
    id: ""
  });

  const Handle_Edit_Delete = async(action, Data) => {
    setAction(action);
    SetNotesModel(Data);
    if (action !== "delete") {
      HandleHideShow();
    }
    else{
      let Datas=await HandleRemove(Data);
    }
  };

  const HandleCategoryClick=async (category,element)=>{
    setActiveIndex(element)
    let Response=null;
    if(element !== 'mainid0'){
   Response =await FetchNotesByCategory({category:category,user:''},PageNo)
   if(Response && Response?.logout==true) {
    logout();
  }
  else
  if (
    Response &&
    Response?.messsage &&
    Response?.messsage?.toString().includes("0:")
  ) {
    SetMessage({ message: Response?.messsage, type: "text-warning" });
    SetLoading(false);
    SetNoRecord(true);
    
    SetNotesList([]);
    handleShowToast();
  } else if(Response==null || Response==undefined || Response?.length==0){
  SetNoRecord(true);
  SetNotesList(Response);
    SetLoading(false);
    }
    else{
      SetNoRecord(false);
  SetNotesList(Response);
    SetLoading(false);
    }
    }
    else{
      Response =await fetchallNotes(PageNo)

    }

    
  }

  const HandleCategory = (value) => {
    handleSelectChange(value);
    SetNotesModel((prev) => ({
      ...prev,
      category: value
    }));
  };

  const HandleSave = async () => {
    console.log(NotesModel);
    let Result = await SaveNotes(NotesModel);
    if(Result && Result?.logout==true) {
      logout();
    }
    else
    if (Result && Result?.success && Result?.success == true) {
      SetMessage({ message: Result.message, type: "text-success" });
      GetRecord();
      handleShowToast();
      HandleHideShow();
    } else if (Result && Result?.error) {
      SetMessage({
        message: Result?.error.join("<br />"),
        type: "text-danger"
      });
      handleShowToast();
    } else {
      SetMessage({ message: Result?.message, type: "text-warning" });
      handleShowToast();
    }
  };

  const HandleRemove = async (_NotesModel) => {
    
    let Result = await RemoveNote(_NotesModel);
    if(Result && Result?.logout==true) {
      logout();
    }
    else
    if (Result && Result?.message && Result?.message?.includes('1:')) {
      let Data=NotesList && NotesList.length > 0 ?  NotesList.filter(x=>x._id !== _NotesModel._id):[];
      SetNotesList(Data);
      GetRecord();
      clearNote();
      SetMessage({ message: Result.message, type: "text-success" });
      handleShowToast();
    }  else {
      SetMessage({ message: Result?.message, type: "text-danger" });
      handleShowToast();
      clearNote();
    }
  };

  

  const handleChange = (field, value) => {
    SetNotesModel({
      title: field == "title" ? value : NotesModel.title,
      category: field == "category" ? value : NotesModel.category,
      content: field == "content" ? value : NotesModel.content
    });
  };
  const HandleHideShow = () => {
    debugger;
    setFormOrList(!Form_Or_List);
    if (Form_Or_List) {
      clearNote();
    }
  };

  const clearNote = () => {
    SetNotesModel({});
  };


  const GetRecord=()=>{
    fetchallNotes(PageNo);
    setActiveIndex('mainid0')
  }


  const fetchallNotes = async (PageNo) => {
    let Response = await FetchAllNotes(PageNo);
      if(Response && Response?.logout==true) {
        logout();
      }
      else{
      if (Response && Response?.messsage && Response?.messsage != "") {
        SetNoRecord(true);
        SetLoading(false);
        SetNotesList([]);
      } else {
        SetNoRecord(Response?.['Notes'] && Response?.['Notes']?.length==0);
        SetLoading(false);
        SetNotesList(Response?.['Notes']);
        SetCategoryList(Response?.['Category']);
        console.clear();console.log(Response?.['TotalCount'])
        SettotalRecord(Response?.['TotalCount']);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if(isAuthenticated){
      let Res = await fetchallNotes();
      }
      else{
        logout();
        SetMessage({ message: 'Logged Out', type: "text-success" });
        handleShowToast();
        navigate("/Login");
      }
    };
    fetchData();
    return () => {
      // Code to run on component unmount (cleanup)
    };
  }, [isAuthenticated]);

  const handleShowToast = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <>
      <div
        className="position-fixed top-2 end-0 p-3"
        style={{ zIndex: 11, marginTop: "-55px" }}
      >
        <ToastComponent
          show={showToast}
          onClose={handleCloseToast}
          type={Message.type}
          message={Message.message}
          duration={3000}
        />
      </div>
      <div className="container">        
        {!Form_Or_List && (
          <div className="row mt-4">
            <div className="col-md-12 d-flex justify-content-end mb-3">
              <button
                className="active align-item-center bg-primary btn d-flex justify-content-center"
                onClick={() => Handle_Edit_Delete("add", NotesModel)}
              >
                <span className="card-icon text-white material-symbols-outlined">
                  add
                </span>
                <span className="text-white">Add Note </span>
              </button>
            </div>
            <div className="col-md-3">
              <ul className="list-group">
                {CategoryList && CategoryList.length > 0 && (
                  <li
                    id="mainid0"
                    className={activeIndex === 'mainid0' ? ' list-group-item d-flex justify-content-between align-items-center noteactive ' : 'list-group-item d-flex justify-content-between align-items-center'}
                    onClick={()=>HandleCategoryClick('','mainid0')}
                  >
                    All
                  </li>
                )}
                {CategoryList &&
                  CategoryList.length > 0 &&
                  CategoryList.map((item,index) => (
                    <li onClick={()=>HandleCategoryClick(item._id,'mainid'+index+1)}
                      id={'mainid'+index+1}
                      className={activeIndex === 'mainid'+index+1 ? ' list-group-item d-flex justify-content-between align-items-center noteactive ' : 'list-group-item d-flex justify-content-between align-items-center'}
                      >
                      {item?.name} <span className="badge bg-info">{item?.noteCount}</span>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="col-md-9 right-panel">
              {ShowLoading == false && ShowNoRecord == false ? (
                
                <div className="row">
                  {NotesList && NotesList.length > 0 && <div className="col-md-12 prevnext_container mb-2">
                     <button onClick={HandlePrev} className="btn prevnextbtn btn-link" disabled={PageNo==1}><span class="prevnext material-symbols-outlined">arrow_back_ios</span></button>
                    <button style={{marginLeft: '8px'}} onClick={HandleNext} className="ml-2 btn prevnextbtn btn-link" disabled={PageNo * 2 >= totalRecord}><span class="prevnext material-symbols-outlined">arrow_forward_ios</span></button>
                    </div>}  
                  {NotesList && NotesList.length > 0
                    ? 

                    NotesList?.map((note) => (
                        <div className="col-md-6">
                          <div className="card mb-3 note-width">
                            <div className="align-items-center card-header cardheader d-flex justify-content-between align-item-center">
                              <span className="badge rounded-pill text-bg-primary">
                                {note.category}
                              </span>
                              <span>
                              <span data-toggle="tooltip" data-placement="top" title="Favorite" className="Favorite card-icon material-symbols-outlined text-gray">star</span> 
                                <span data-toggle="tooltip" data-placement="top" title="Edit"
                                  className="card-icon material-symbols-outlined text-primary"
                                  onClick={() =>
                                    Handle_Edit_Delete("edit", note)
                                  }
                                >
                                  edit
                                </span>
                                <span data-toggle="tooltip" data-placement="top" title="Remove"
                                  className="card-icon material-symbols-outlined text-danger"
                                  onClick={() =>
                                    Handle_Edit_Delete("delete", note)
                                  }
                                >
                                  close
                                </span>
                              </span>
                            </div>
                            <div className="card-body">
                              <p className="card-title">{note.title}</p>
                              <p className="card-text" dangerouslySetInnerHTML={{ __html: note.content }} ></p>
                              
                            </div>
                            <div className="card-footers">
                              <p className="card-title badge">
                                {formatDistanceToNow(note.createdAt, {
                                  addSuffix: true
                                })}
                              </p>
                            </div>
                          </div>{" "}
                        </div>
                      ))
                    : ""}
                </div>
                
              ) : (
                ""
              )}
              {ShowNoRecord && (
                <div className="norecord_note">
                  <img src="https://formulatedpolymers.com/Product_fpl/images/norecord.png" />
                </div>
              )}

              {ShowLoading && (
                <div className="row">
                  <div className="col-md-6">
                    <div className="card-skeleton">
                      <div className="skeleton-header">
                        <div className="skeleton skeleton-badge"></div>
                        <div className="d-flex">
                          <div className="skeleton skeleton-icon"></div>
                          <div className="skeleton skeleton-icon"></div>
                        </div>
                      </div>
                      <div className="card-body card-skeleton-body">
                        <div className="skeleton skeleton-title"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card-skeleton">
                      <div className="skeleton-header">
                        <div className="skeleton skeleton-badge"></div>
                        <div className="d-flex">
                          <div className="skeleton skeleton-icon"></div>
                          <div className="skeleton skeleton-icon"></div>
                        </div>
                      </div>
                      <div className="card-body card-skeleton-body">
                        <div className="skeleton skeleton-title"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card-skeleton">
                      <div className="skeleton-header">
                        <div className="skeleton skeleton-badge"></div>
                        <div className="d-flex">
                          <div className="skeleton skeleton-icon"></div>
                          <div className="skeleton skeleton-icon"></div>
                        </div>
                      </div>
                      <div className="card-body card-skeleton-body">
                        <div className="skeleton skeleton-title"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card-skeleton">
                      <div className="skeleton-header">
                        <div className="skeleton skeleton-badge"></div>
                        <div className="d-flex">
                          <div className="skeleton skeleton-icon"></div>
                          <div className="skeleton skeleton-icon"></div>
                        </div>
                      </div>
                      <div className="card-body card-skeleton-body">
                        <div className="skeleton skeleton-title"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card-skeleton">
                      <div className="skeleton-header">
                        <div className="skeleton skeleton-badge"></div>
                        <div className="d-flex">
                          <div className="skeleton skeleton-icon"></div>
                          <div className="skeleton skeleton-icon"></div>
                        </div>
                      </div>
                      <div className="card-body card-skeleton-body">
                        <div className="skeleton skeleton-title"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card-skeleton">
                      <div className="skeleton-header">
                        <div className="skeleton skeleton-badge"></div>
                        <div className="d-flex">
                          <div className="skeleton skeleton-icon"></div>
                          <div className="skeleton skeleton-icon"></div>
                        </div>
                      </div>
                      <div className="card-body card-skeleton-body">
                        <div className="skeleton skeleton-title"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-text"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {Form_Or_List && (
          <div className="row mt-4">
            <div className="col-md-12 formheader">
              <p style={{ marginTop: "5px", color: "white" }}>
                Add / Update Note
              </p>
            </div>
            <div className="col-md-12 FormPanel">
              <div className="row mt-3">
                <div className="col-md-12 mb-3">
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={SelCategory}
                    onInput={(e) => HandleCategory(e.target.value)}
                  >
                                        <option value="0">New</option>

                      {CategoryList &&
                  CategoryList.length > 0 &&
                  CategoryList.map((item,index) => (
                    <option value= {item?.name} 
                      >
                      {item?.name} 
                    </option>
                  ))}

                  </select>
                </div>
                <div className="col-md-12 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    value={NotesModel.category}
                    placeholder="Category"
                    onChange={(e) => handleChange("category", e.target.value)}
                  />
                </div>
                <div className="col-md-12 mb-3">
                  <input
                    type="text"
                    value={NotesModel.title}
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Title"
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
                </div>
                <div className="col-md-12 mb-3">
                <CustomTinyMCEEditor onEditorChange={handleEditorChange} />
                  </div>
                  <div className="col-md-10"></div>
                <div className="col-md-2 mb-3 d-flex">
                  <button
                    style={{ padding: "6px" }}
                    className="btn btn-primary d-flex justify-content-center align-items-center "
                    onClick={HandleHideShow}
                  >
                    <span
                      className="text-white material-symbols-outlined"
                      style={{ fontSize: "20px" }}
                    >
                      arrow_back
                    </span>
                    <span className="text-white">Back</span>
                  </button>
                  &nbsp; &nbsp;
                  <button
                    style={{ padding: "6px" }}
                    className="btn btn-success d-flex justify-content-center align-items-center w-50"
                    onClick={HandleSave}
                  >
                    <span
                      className="text-white material-symbols-outlined"
                      style={{ fontSize: "20px" }}
                    >
                      check_circle
                    </span>
                    <span className="text-white">{Action}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
