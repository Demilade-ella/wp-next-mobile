const API_URL = "http://localhost:8080/wp-json";

export async function fetchPosts(selectedCategory?: string | number, perPage: number = 20) {
  let url = `${API_URL}/wp/v2/posts?_embed&per_page=${perPage}`;
  if (selectedCategory && selectedCategory !== "all" && selectedCategory !== "") {
    url += `&categories=${selectedCategory}`;
  }
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.text();
    console.error("WordPress API Error Response:", errorData);
    throw new Error(`Failed to fetch posts: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/wp/v2/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function checkForNewPost(categoryId?: string | number) {
  let url = `${API_URL}/wp/v2/posts?_embed&per_page=1`;
  if (categoryId && categoryId !== "all" && categoryId !== "") {
    url += `&categories=${categoryId}`;
  }
  
  const res = await fetch(url);
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Polling API Error Details:", errorText);
    throw new Error("Polling failed");
  }
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

export async function uploadMedia(file: File, token: string): Promise<number | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8080/wp-json/wp/v2/media", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Authenticated user JWT
        "Content-Disposition": `attachment; filename="${file.name}"`,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok && data.id) {
      return data.id; // Returns WordPress Attachment ID
    } else {
      console.error("Media upload error:", data);
      return null;
    }
  } catch (err) {
    console.error("Failed to upload image:", err);
    return null;
  }
}

export async function registerUser(userData: { username: string; email: string; password: string }) {
  const res = await fetch("http://localhost:8080/wp-json/wp/v2/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa("admin:zcVK 7Xoo T43S 5CaX vwAn Ebyk"),
    },
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      roles: ["author"],
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Registration failed. Username or email may already exist.");
  }
  return data;
}

export async function loginUser(credentials: { username: string; password: string }) {
  const res = await fetch("http://localhost:8080/wp-json/jwt-auth/v1/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok || !data.token) {
    throw new Error(data.message || "Invalid credentials.");
  }
  return data.token; // Returns the JWT token string
}

export async function createPost(
  postData: {
    title: string;
    content: string;
    status: string;
    categories: number[];
    featured_media?: number;
  },
  token: string
) {
  const res = await fetch("http://localhost:8080/wp-json/wp/v2/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to submit post.");
  }
  return data;
}