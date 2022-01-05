<template>
  <div class="create-post">
    <Loading v-show="loading"/>
    <div class="container">
      <div :class="{invisible: !error}" class="err-message">
        <p><span>Fehler: {{ this.errorMsg }}</span></p>
      </div>
      <div class="blog-info">
        <input type="text" placeholder="Post Titel eingeben" v-model="blogTitle">
      </div>
      <div class="editor">
        <vue-editor v-model="blogHTML" />
      </div>
      <div class="blog-actions">
        <button @click="updateBlog">Änderungen Speichern</button>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "../components/Loading.vue";
import db from "../firebase/firebaseInit";

export default {
  name: "CreatePost",
  components: {
    Loading
  },
  data() {
    return {
      error: null,
      errorMsg: null,
      loading: null,
      routeID: null,
      currentBlog: null,
    }
  },
  async mounted() {
    this.routeID = this.$route.params.blogid;
    this.currentBlog = await this.$store.state.blogPosts.filter(post => {
      return post.blogID === this.routeID;
    });
    this.$store.commit("setBlogState", this.currentBlog[0])
  },
  methods: {
    async updateBlog() {
      const dataBase = db.collection('blogPosts').doc(this.routeID);
      if (this.blogTitle.length !== 0 && this.blogHTML.length !== 0) {
        this.loading = true;
        const timestamp = await Date.now();

        await dataBase.update({
          blogHTML: this.blogHTML,
          blogTitle: this.blogTitle,
          dateEdited: timestamp,
        });

        await this.$store.dispatch('updatePost', this.routeID)
        
        this.loading = false;
        this.$router.push({ name: "Home" })
        
        return;
      }

      this.error = true;
      this.errorMsg = "Bitte sicherstellen, dass Post Titel und Inhalt nicht leer sind!"
      
      setTimeout(() => {
        this.error = false;
      }, 5000)
      return;
    },
  },
  computed: {
    profileId() {
      return this.$store.state.profileId;
    },
    blogTitle: {
      get() {
        return this.$store.state.blogTitle;
      },
      set(payload) {
        this.$store.commit("updateBlogTitle", payload);
      }
    },
    blogHTML: {
      get() {
        return this.$store.state.blogHTML;
      },
      set(payload) {
        this.$store.commit("newBlogPost", payload);
      }
    }
  }

}
</script>

<style lang="scss">
.create-post {
  position: relative;
  height: 100%;
  button {
    margin-top: 0;
  }
  .router-button {
    text-decoration: none;
    color: #fff;
  }
  label,
  button,
  .router-button {
    transition: 0.5s ease-in-out all;
    align-self: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 20px;
    padding: 12px 24px;
    color: #fff;
    background-color: #303030;
    text-decoration: none;
    &:hover {
      background-color: rgba(48, 48, 48, 0.7);
    }
  }
  .container {
    position: relative;
    height: 100%;
    padding: 10px 25px 60px;
  }
  .invisible {
    opacity: 0 !important;
  }
  .err-message {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    color: #fff;
    margin-bottom: 10px;
    background-color: #303030;
    opacity: 1;
    transition: 0.5s ease all;
    p {
      font-size: 14px;
    }
    span {
      font-weight: 600;
    }
  }
  .blog-info {
    display: flex;
    margin-bottom: 32px;
    input:nth-child(1) {
      min-width: 300px;
    }
    input {
      transition: 0.5s ease-in-out all;
      padding: 10px 4px;
      border: none;
      border-bottom: 1px solid #303030;
      &:focus {
        outline: none;
        box-shadow: 0 1px 0 0 #303030;
      }
    }
    .upload-file {
      flex: 1;
      margin-left: 16px;
      position: relative;
      display: flex;
      input {
        display: none;
      }
      .preview {
        margin-left: 16px;
        text-transform: initial;
      }
      span {
        font-size: 12px;
        margin-left: 16px;
        align-self: center;
      }
    }
  }
  .editor {
    height: 60vh;
    display: flex;
    flex-direction: column;
    .quillWrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .ql-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: scroll;
    }
    .ql-editor {
      padding: 20px 16px 30px;
    }
  }
  .blog-actions {
    margin-top: 32px;
    button {
      margin-right: 16px;
    }
  }
}
</style>