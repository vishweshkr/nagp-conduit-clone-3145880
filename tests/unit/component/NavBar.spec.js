import { shallowMount } from "@vue/test-utils";
import NavBar from "@/components/NavBar.vue";
import store from "@/store";
import router from "@/router";

let wrapper;

describe("NavBar.vue", () => {
  beforeEach(() => {
    wrapper = shallowMount(NavBar, { store, router });
  });

  it("should'nt show usrname befoer login", () => {
    const navItems = wrapper.findAll(".nav-item");
    expect(navItems.length).toBe(3);
  });
  it("should show usrname after login", async () => {
    await wrapper.vm.$store.dispatch("users/loginUser", {
      email: "vishweshkumar9@gmail.com",
      password: "hello123"
    });
    const navItems = wrapper.findAll(".nav-item");
    const username = navItems.at(navItems.length - 1).text();
    expect(username).toBe("Vishwesh");
  });
});
