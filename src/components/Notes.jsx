import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { FiPlus, FiFolder, FiFile, FiTrash2, FiEdit2, FiSave, FiX, FiEdit3 } from 'react-icons/fi';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState(['default']);
  const [selectedFolder, setSelectedFolder] = useState('default');
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    folder: 'default'
  });

  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Add user state
  const [user, setUser] = useState(null);

  // Add useEffect to get user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Update useEffect to depend on user
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [selectedFolder, user]); // Add user to dependencies

  const fetchNotes = async () => {
    try {
      if (!user) return;

      setLoading(true);
      setError(null); // Reset error state

      // First, get all folders for the user
      const { data: folderData, error: folderError } = await supabase
        .from('notes')
        .select('folder')
        .eq('user_id', user.id);

      if (folderError) throw folderError;

      const uniqueFolders = [...new Set(folderData.map(note => note.folder))];
      setFolders(['default', ...uniqueFolders.filter(f => f !== 'default')]);

      // Then get notes for the selected folder
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .eq('folder', selectedFolder)
        .order('created_at', { ascending: false });

      if (notesError) throw notesError;

      setNotes(notesData || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    try {
      if (!newNote.title || !user) return;
      setError(null);

      const newNoteData = {
        title: newNote.title,
        content: newNote.content || '',
        folder: selectedFolder,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('notes')
        .insert([newNoteData])
        .select()
        .single();

      if (error) throw error;

      setNotes(prevNotes => [data, ...prevNotes]);
      setNewNote({ title: '', content: '', folder: selectedFolder });
    } catch (error) {
      console.error('Error creating note:', error);
      setError(error.message);
    }
  };

  const updateNote = async (note) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: note.title,
          content: note.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', note.id);

      if (error) throw error;

      setNotes(notes.map(n => n.id === note.id ? { ...n, ...note } : n));
      setSelectedNote(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteNote = async (id) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const addFolder = async () => {
    try {
      if (!newFolderName || !user) return;
      setError(null);

      // Create a default note in the new folder to establish it
      const { error } = await supabase
        .from('notes')
        .insert([{
          title: 'Welcome to your new folder!',
          content: 'Start adding notes to this folder.',
          folder: newFolderName,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setFolders(prev => [...prev, newFolderName]);
      setSelectedFolder(newFolderName);
      setShowNewFolder(false);
      setNewFolderName('');
      
      // Fetch notes for the new folder
      fetchNotes();
    } catch (error) {
      console.error('Error adding folder:', error);
      setError(error.message);
    }
  };

  return (
    <div className="notes-container">
      <div className="folders-sidebar">
        <div className="folders-header">
          <h2>Folders</h2>
          <button 
            className="add-folder-button"
            onClick={() => setShowNewFolder(true)}
          >
            <FiPlus />
          </button>
        </div>

        <div className="folders-list">
          {folders.map(folder => (
            <button
              key={folder}
              className={`folder-item ${selectedFolder === folder ? 'active' : ''}`}
              onClick={() => setSelectedFolder(folder)}
            >
              <FiFolder /> {folder}
            </button>
          ))}
        </div>

        {showNewFolder && (
          <div className="new-folder-form">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name..."
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newFolderName) {
                  addFolder();
                }
              }}
            />
            <div className="new-folder-actions">
              <button 
                onClick={addFolder} 
                className="add-btn"
                disabled={!newFolderName}
              >
                <FiPlus /> Add
              </button>
              <button 
                onClick={() => setShowNewFolder(false)} 
                className="cancel-btn"
              >
                <FiX /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="notes-main">
        <div className="notes-header">
          <h2>{selectedFolder}</h2>
          <div className="notes-actions">
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder="Enter note title..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newNote.title) {
                  createNote();
                }
              }}
            />
            <button 
              onClick={createNote} 
              disabled={!newNote.title}
              className="add-note-btn"
            >
              <FiPlus /> Add Note
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="notes-loading">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="notes-empty">
            <FiFile />
            <h3>No notes in {selectedFolder}</h3>
            <p>Start by adding your first note</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map(note => (
              <div key={note.id} className="note-card">
                {selectedNote?.id === note.id ? (
                  <div className="note-edit">
                    <input
                      type="text"
                      value={selectedNote.title}
                      onChange={(e) => setSelectedNote({ 
                        ...selectedNote, 
                        title: e.target.value 
                      })}
                      placeholder="Note title"
                      autoFocus
                    />
                    <textarea
                      value={selectedNote.content}
                      onChange={(e) => setSelectedNote({ 
                        ...selectedNote, 
                        content: e.target.value 
                      })}
                      placeholder="Write your note here..."
                    />
                    <div className="note-edit-actions">
                      <button onClick={() => updateNote(selectedNote)} className="save-btn">
                        <FiSave /> Save
                      </button>
                      <button onClick={() => setSelectedNote(null)} className="cancel-btn">
                        <FiX /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="note-header">
                      <h3>{note.title}</h3>
                      <div className="note-actions">
                        <button 
                          onClick={() => setSelectedNote(note)}
                          className="edit-btn"
                          title="Edit note"
                        >
                          <FiEdit3 />
                        </button>
                        <button 
                          onClick={() => deleteNote(note.id)}
                          className="delete-btn"
                          title="Delete note"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <p className="note-content">
                      {note.content || 'No content'}
                    </p>
                    <div className="note-footer">
                      <span>Created: {new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes; 