import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import NewNote from "./pages/new-notes-page";
import useLocalStorage from "./components/useLocalStorage";
import { useMemo } from "react"
 import { v4 as uuidV4 } from "uuid";
import NoteList from "./pages/note-list-page";
import { NoteLayout } from "./pages/note.layout";
import { Note } from "./pages/note";
import { EditNote } from "./pages/edit-note";


export type Note = {
  id: string
} & NoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}

export type RawNote = {
  id: string
} & RawNoteData

const App = () => {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])
  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])

    function onCreateNote({ tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) },
      ]
    })
  };

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map(tag => tag.id) }
        } else {
          return note
        }
      })
    })
  }

  function onDeleteNote(id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  };

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

function updateTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return { ...tag, label }
        } else {
          return tag
        }
      })
    })
  }

  function deleteTag(id: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  };
  
  return (
    <Container className="my-4">
    <Routes>
      <Route path="/" element={<NoteList  notes={notesWithTags}
              availableTags={tags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
              />} />
      <Route path="/new" element={<NewNote
      onSubmit={onCreateNote}
      onAddTag={addTag}
      availableTags={tags}
      />} />
      <Route path="/:id" element={<NoteLayout notes={notesWithTags}/>}>
        <Route index element={<Note onDelete={onDeleteNote}
         />} />
        <Route path="edit" element={<EditNote 
           onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
                />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </Container>
  );
};

export default App;
