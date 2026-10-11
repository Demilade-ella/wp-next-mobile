'use client';

import { useEffect, useState } from 'react';
import { Post, Category } from "@/types";
import { fetchPosts, fetchCategories, checkForNewPost, uploadMedia, registerUser, loginUser, createPost } from "@/services/api";
import { getCurrentPositionAsync } from "@/utils/fileHelpers";

import Header from "@/components/ui/Header";
import BottomNav from "@/components/ui/BottomNav";
import IncidentCard from "@/components/feed/IncidentCard";
import CategoryFilter from "@/components/feed/CategoryFilter";
import NotificationBanner from "@/components/feed/NotificationBanner";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ReportForm from "@/components/report/ReportForm";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"feed" | "report">("feed");
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false); // Toggle between Login & Register
  const [regUsername, setRegUsername] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const [latestPostId, setLatestPostId] = useState<number | null>(null);
  const [hasNewIncidents, setHasNewIncidents] = useState<boolean>(false);

  // const WP_USER = "admin";
  // const WP_APP_PASSWORD = "zcVK 7Xoo T43S 5CaX vwAn Ebyk";

  // const credentials = btoa(`${WP_USER}:${WP_APP_PASSWORD}`);

  useEffect(() => {
    const savedToken = localStorage.getItem("jwt_token");
    if (savedToken) {
      setToken(savedToken);
    }
    loadCategories();
    loadPosts("all");
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const loadPosts = async (selectedCategory: string | number) => {
    setLoading(true);
    try {
      const data = await fetchPosts(selectedCategory);
      setPosts(data);
      if (data.length > 0 && latestPostId === null) {
        setLatestPostId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  // Background polling for notifications
  useEffect(() => {
    if (posts.length > 0 && latestPostId === null) {
      setLatestPostId(posts[0].id);
    }

    const interval = setInterval(async () => {
      try {
        const newestPost = await checkForNewPost(selectedCategory === null ? undefined : selectedCategory);

        if (newestPost && latestPostId !== null) {
          if (newestPost.id > latestPostId) {
            setHasNewIncidents(true);

            if (Notification.permission === "granted") {
              new Notification("New Emergency Incident!", {
                body: newestPost.title.rendered.replace(/(<([^>]+)>)/gi, ""),
                icon: "/favicon.ico",
              });
            }
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [latestPostId, selectedCategory]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Handle User Signup
  const handleRegister = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError(null);
    (async () => {

    try {
      // 1. Register the user in WordPress
      await registerUser({
        username: regUsername,
        email: regEmail,
        password: regPassword,
      });

      // 2. Auto-login immediately after successful registration
      setUsername(regUsername);
      setPassword(regPassword);
      
      const jwtToken = await loginUser({
        username: regUsername,
        password: regPassword,
      });

      // 3. Persist session state
      setToken(jwtToken);
      localStorage.setItem("jwt_token", jwtToken);
      
    } catch (err: any) {
      console.error("Signup error:", err);
      setAuthError(err.message || "Failed to connect to the server.");
    } finally {
      setIsLoggingIn(false);
    }
    })();
  };

  // Handle User Login
  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError(null);

    // try {
    //   const res = await fetch("http://localhost:8080/wp-json/jwt-auth/v1/token", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ username, password }),
    //   });

    //   const data = await res.json();

    //   if (res.ok && data.token) {
    //     setToken(data.token);
    //     localStorage.setItem("jwt_token", data.token); // Store token for sessions
    //     setUsername("");
    //     setPassword("");
    //   } else {
    //     setAuthError(data.message || "Invalid username or password.");
    //   }
    // } catch (err) {
    //   console.error("Login error:", err);
    //   setAuthError("Failed to connect to authentication server.");
    // } finally {
    //   setIsLoggingIn(false);
    // }

    try {
      const jwtToken = await loginUser({
        username,
        password,
      });

      setToken(jwtToken);
      localStorage.setItem("jwt_token", jwtToken);
      
    } catch (err: any) {
      console.error("Login error:", err);
      setAuthError(err.message || "Invalid credentials or server error.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle User Logout
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("jwt_token");
  };

  // useEffect(() => {
  //   fetch('http://localhost:8080/wp-json/wp/v2/categories')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (Array.isArray(data)) setCategories(data);
  //     })
  //     .catch((err) => console.error('Error fetching categories:', err));
  // }, []);

  // const fetchPosts = async () => {
  //   setLoading(true);
  //   let url = "http://localhost:8080/wp-json/wp/v2/posts?_embed&per_page=20";
  //   if (selectedCategory !== null) {
  //     url += `&categories=${selectedCategory}`;
  //   }
  //   try {
  //     const res = await fetch(url);
  //     if (res.ok) {
  //       const data: IncidentPost[] = await res.json();
  //       setPosts(data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching posts:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  // Handle Geolocation capture
  const handleGetLocation = async () => {
    setGettingLocation(true);
    setStatusMessage(null);

    try {
      const coords = await getCurrentPositionAsync();
      setLocation(coords);
    } catch (error) {
      console.error("Error getting location:", error);
      setStatusMessage("Unable to retrieve your location.");
    } finally {
      setGettingLocation(false);
    }
  };

  // Submit Incident Form
  const handleSubmitIncident = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !description || !categoryId) {
      setStatusMessage("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setStatusMessage("");

    let finalContent = description;
    if (location) {
      finalContent += `<br/><br/><strong>Location:</strong> Lat: ${location.lat}, Lng: ${location.lng}`;
    }

    // const authHeader = "Basic " + btoa(`${WP_USER}:${WP_APP_PASSWORD.replace(/\s+/g, '')}`);

    // const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAiLCJpYXQiOjE3OTE2NzI0MTMsIm5iZiI6MTc5MTY3MjQxMywiZXhwIjoxNzkyMjc3MjEzLCJkYXRhIjp7InVzZXIiOnsiaWQiOiIxIn19fQ.yktH3gG-0UO0LuwLxVaV-tJl3TNfFpAvcdiueZ4ouyw";
    const token = localStorage.getItem("jwt_token");

    try {
      let mediaId: number | null = null;

      if (selectedImage && token) {
        setIsUploadingImage(true);
        mediaId = await uploadMedia(selectedImage, token);
        setIsUploadingImage(false);
      }

      const postData: any = {
        title: title,
        content: finalContent,
        status: "publish",
        categories: [Number(categoryId)],
        ...(mediaId ? { featured_media: mediaId } : {}),
      };

      await createPost(postData, token!);

      setStatusMessage("Incident reported successfully!");
      setTitle("");
      setDescription("");
      setCategoryId("");
      setLocation(null);
      setSelectedImage(null);
      setImagePreview(null);
      loadPosts("all");
      
      setTimeout(() => {
        setActiveTab("feed");
        setStatusMessage("");
      }, 1500);
    } catch (err: any) {
      console.error("Error submitting post:", err);
      setStatusMessage("Failed to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="app-container">

      <Header token={token} onLogout={handleLogout} />

      {activeTab === "feed" ? (
        <div>
          <div className="feed-header">
            <h2 className="feed-title">Public Incident Feed</h2>
            <button
              onClick={() => loadPosts(selectedCategory === null ? "all" : selectedCategory)}
              className="refresh-btn"
            >
              Refresh
            </button>
          </div>

          {hasNewIncidents && (
            <NotificationBanner
              onRefresh={() => {
                loadPosts(selectedCategory === null ? "all" : selectedCategory);
                setHasNewIncidents(false);
                if (posts.length > 0) setLatestPostId(posts[0].id);
              }}
            />
          )}

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory ?? "all"}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId === "all" ? null : Number(catId));
              loadPosts(catId === "all" ? "all" : catId);
            }}
          />

          <div>
            {loading ? (
              <div className="loading-text">Loading incidents...</div>
            ) : posts.length === 0 ? (
              <div className="empty-text">
                No incidents reported yet.
              </div>
            ) : (
              posts.map((post) => (
                <IncidentCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2>Report an Emergency</h2>
          {!token ? (
            !isSigningUp ? (
              <LoginForm
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                isLoggingIn={isLoggingIn}
                authError={authError}
                switchToRegister={() => { setIsSigningUp(true); setAuthError(null); }}
              />
            ) : (
              <RegisterForm
                regUsername={regUsername}
                setRegUsername={setRegUsername}
                regEmail={regEmail}
                setRegEmail={setRegEmail}
                regPassword={regPassword}
                setRegPassword={setRegPassword}
                handleRegister={handleRegister}
                isLoggingIn={isLoggingIn}
                authError={authError}
                switchToLogin={() => { setIsSigningUp(false); setAuthError(null); }}
              />
            )
          ) : (
            <ReportForm
              categories={categories}
              categoryId={categoryId}
              setCategoryId={(val) => setCategoryId(typeof val === "string" ? (val === "" ? "" : Number(val)) : val)}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              imagePreview={imagePreview}
              isUploadingImage={isUploadingImage}
              onImageChange={(e) => {
                if (e.target.files?.[0]) {
                  setSelectedImage(e.target.files[0]);
                  setImagePreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              onRemoveImage={() => { setSelectedImage(null); setImagePreview(null); }}
              location={location}
              gettingLocation={gettingLocation}
              onGetLocation={handleGetLocation}
              handleSubmit={handleSubmitIncident}
              isSubmitting={submitting}
              statusMessage={statusMessage}
            />
          )}
        </div>
      )}

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}