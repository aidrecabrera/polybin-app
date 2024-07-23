import { supabase } from "@/client/supabaseClient";
import { useMutation, useQuery } from "@tanstack/react-query";

function signInUser() {
  return useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
  });
}

function logoutUser() {
  return useMutation({
    mutationKey: ["sign-out"],
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  });
}

function fetchSession() {
  return useMutation({
    mutationKey: ["session"],
    mutationFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data;
    },
  });
}

function isAuthenticated() {
  return useQuery({
    queryKey: ["is-authenticated"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data;
    },
  });
}

export { fetchSession, isAuthenticated, logoutUser, signInUser };

