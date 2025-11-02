import { useState, FormEvent } from "react";
import blogApiService from "../../api/blog";
import { toast } from "react-toastify";

interface BlogFormProps {
  postId: string;
  onCommentSubmitted?: () => void;
}

const BlogForm = ({ postId, onCommentSubmitted }: BlogFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    content: "",
  });
  const [saveInfo, setSaveInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await blogApiService.createComment({
        name: formData.name,
        email: formData.email,
        website: formData.website || undefined,
        content: formData.content,
        postId: postId,
      });
      
      toast.success("Comment submitted successfully! It will be reviewed before publishing.");
      
      // Clear form
      setFormData({
        name: saveInfo ? formData.name : "",
        email: saveInfo ? formData.email : "",
        website: saveInfo ? formData.website : "",
        content: "",
      });
      
      // Refresh comments
      if (onCommentSubmitted) {
        setTimeout(() => {
          onCommentSubmitted();
        }, 1000);
      }
    } catch (err: any) {
      console.error("Failed to submit comment:", err);
      toast.error(err?.message || "Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row gx-15">
        <div className="col-lg-12">
          <textarea
            className="textarea mb-5"
            placeholder="Comment *"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-lg-4 mb-15">
          <input
            className="input"
            type="text"
            placeholder="Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-lg-4 mb-15">
          <input
            className="input"
            type="email"
            placeholder="Email *"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-lg-4 mb-15">
          <input
            className="input"
            type="text"
            placeholder="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
        </div>
        <div className="col-lg-12">
          <div className="review-checkbox d-flex align-items-center mb-25">
            <input
              className="tg-checkbox"
              type="checkbox"
              id="save-info"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
            />
            <label htmlFor="save-info" className="tg-label">
              Save my name, email, and website in this browser for the next time I comment.
            </label>
          </div>
          <button
            type="submit"
            className="tg-btn tg-btn-switch-animation"
            disabled={submitting}
          >
            <span className="d-flex align-items-center justify-content-center">
              <span className="btn-text">{submitting ? "Submitting..." : "Submit Post"}</span>
              <span className="btn-icon ml-5">
                <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.0017 8.00001H19.9514M19.9514 8.00001L12.9766 1.02515M19.9514 8.00001L12.9766 14.9749" stroke="white" strokeWidth="1.77778" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="btn-icon ml-5">
                <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.0017 8.00001H19.9514M19.9514 8.00001L12.9766 1.02515M19.9514 8.00001L12.9766 14.9749" stroke="white" strokeWidth="1.77778" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
