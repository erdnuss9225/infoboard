<template>
  <div class="post">
    <div class="header">
      <h3 class="title">{{ post.blogTitle }}</h3>
      <div v-if="currentUser" class="controls">
        <div @click="editBlog" class="icon">
          <Edit class="edit" />
        </div>
        <div @click="deletePost" class="icon">
          <Delete class="delete" />
        </div>
      </div>
    </div>
    <div class="meta">
      <div class="initials">
        <span>{{ profileInfo.initials }}</span>
      </div>
      <div class="info">
        <p vclass="name">{{ profileInfo.firstName }} {{ profileInfo.lastName }}</p>
        <p class="timestamp">Erstellt am {{formattedDate(this.post.blogDate)}}</p>
        <p v-show="this.post.blogDateEdited" class="timestamp">Bearbeitet am {{formattedDate(this.post.blogDateEdited)}}</p>
      </div>
    </div>
    <div class="content ql-editor" v-html="post.blogHTML">
    </div>
  </div>
</template>

<script>
import Edit from "../assets/Icons/edit-regular.svg";
import Delete from "../assets/Icons/trash-regular.svg";
import db from "../firebase/firebaseInit";

export default {
  name: "post",
  props: ["post"],
  components: {
    Edit, Delete
  },
  data() {
    return {
      profileInfo: "",
      editRight: null,
    }
  },
  methods: {
    formattedDate(inputDate) {
      const date = new Date(inputDate);
      const day = date.toLocaleString("de-de", { dateStyle: "short" });
      const hour = date.getHours();
      let minute = date.getMinutes();
      if (minute < 10) {
        minute = "0" + minute;
      }
      const fullDate = `${day}, ${hour}:${minute}`
      
      return fullDate;
    },
    deletePost() {
      this.$store.dispatch("deletePost", this.post.blogID);
    },
    editBlog() {
      this.$router.push({ name: "EditPost", params: {blogid: this.post.blogID} })
    },
  },
  computed: {
    currentUser() {
      if(this.$store.state.profileId === this.post.profileID) {
        return true;
      }
      return false;
    },
  },
  async created() {
    const dataBase = await db.collection('users').doc(this.post.profileID);
    const dbResults = await dataBase.get();

    const firstName = dbResults.data().firstName;
    const lastName = dbResults.data().lastName;

    this.profileInfo = {
      firstName: firstName,
      lastName: lastName,
      initials: firstName.match(/(\b\S)?/g).join("") + lastName.match(/(\b\S)?/g).join(""),
    }
  }
}
</script>

<style lang="scss" scoped>
.post {
  border-radius: 20px;
  padding: 20px;
  border-left: 4px solid #1b89e4 ;
  box-shadow: 0 0 5px 1px rgba(0,0,0,0.2);
  margin-bottom: 48px;

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;

    .controls{
      display: flex;
      
      .icon {
        display: flex;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: #fff;
        transition: 0.5s ease all;
        &:hover {
          background-color: #1b89e4;
          .edit,
          .delete {
            path {
              fill: #fff;
            }
          }
        }
        &:nth-child(1) {
          margin-right: 8px;
        }
        .edit,
        .delete {
          pointer-events: none;
          height: 15px;
          width: auto;
        }
      }
    }
  }
  .meta {
    display: flex;
    align-items: center;
    .initials {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: #fff;
      background-color: #303030;
      margin-right: 16px;
    }
    .info {
      .timestamp {
        font-size: 14px;
      }
    }
  }
  .content {
    margin-top: 24px;
    padding-top: 24px;
    &.ql-editor {
      min-height: 0;
      padding-right: 0;
      padding-left: 0;
    }
  }
}
</style>