import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { FiCamera, FiTrash2, FiX, FiSave } from 'react-icons/fi';

const EditProfile = ({ user, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [user]);

  const getProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          full_name: data.full_name || '',
          avatar_url: data.avatar_url
        });
        setPreviewUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const uploadAvatar = async (event) => {
    try {
      setLoading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;

      // Delete old avatar if exists
      if (formData.avatar_url) {
        const oldFileName = formData.avatar_url.split('/').pop();
        await supabase.storage
          .from('avatars')
          .remove([oldFileName]);
      }

      // Upload new file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (urlError) throw urlError;

      setFormData(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));

    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setLoading(true);
      if (formData.avatar_url) {
        const fileName = formData.avatar_url.split('/').pop();
        await supabase.storage
          .from('avatars')
          .remove([fileName]);
      }
      setFormData(prev => ({
        ...prev,
        avatar_url: null
      }));
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error removing avatar:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const updates = {
        ...formData,
        id: user.id,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;
      
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Update Profile</h2>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={updateProfile} className="edit-profile-form">
          <div className="avatar-upload">
            <div className="avatar-preview-container">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar" className="avatar-preview" />
              ) : (
                <div className="avatar-placeholder">
                  {formData.full_name ? formData.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase()}
                </div>
              )}
              <div className="avatar-actions">
                <label className="avatar-action-button">
                  <FiCamera />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={loading}
                  />
                </label>
                {previewUrl && (
                  <button
                    type="button"
                    className="avatar-action-button delete"
                    onClick={removeAvatar}
                    disabled={loading}
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="form-single">
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your display name"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={loading}>
              <FiSave />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile; 