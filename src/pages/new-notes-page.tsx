import { NoteData, Tag } from "../App";
import NoteForm from "../components/note-form";

 type NewNoteProps = {
    onSubmit : (data : NoteData) => void
    onAddTag: (tag: Tag) => void
  availableTags: Tag[]
 }

const NewNote = ({onSubmit, onAddTag, availableTags }: NewNoteProps) =>{
    return(
        <>
         <h1>NEW NOTE</h1>
        <NoteForm 
        onSubmit={onSubmit}
         onAddTag={onAddTag}
        availableTags={availableTags} />
        </>
    )
}

export default NewNote;