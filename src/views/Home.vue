<template>
  <div class="home">
    <BannerSection v-if="!user" :post="welcomeScreen" />
    <div v-if="user" class="posts">
      <div class="container">
        <div class="button-wrap">
          <router-link class="router-button" :to="{ name: 'CreatePost' }">Neuer Post</router-link>
        </div>
        <Post :post="post" v-for="(post, index) in blogPosts" :key="index" />
      </div>
    </div>
  </div>
</template>

<script>
import BannerSection from "../components/BannerSection.vue";
import Post from "../components/Post.vue";

export default {
  name: "Home",
  components: { BannerSection, Post },
  data() {
    return {
      welcomeScreen: {
        title: "Willkommen an Infoboard!",
        blogPost: "Mit dem Infoboard kannst Du Informationen mit deinen Teammitgliedern teilen und bleibst so jederzeit auf dem Laufenden. Logge dich jetzt ein oder registriere Dich, wenn Du neu bist!",
        welcomeScreen: true,
        photo: "communication",
      },
    }
  },
  computed: {
    sampleBlogCards() {
      return this.$store.state.sampleBlogCards
    },
    user() {
      return this.$store.state.user;
    },
    blogPosts() {
      return this.$store.state.blogPosts;
    },
  },
};
</script>
<style lang="scss" scoped>
.posts {
  .container {
    padding: 60px 25px;
    .button-wrap {
      text-align: right;
      height: fit-content;
      padding-bottom: 50px;
      .router-button {
        text-decoration: none;
        background-color: #1b89e4;
        &:hover {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
