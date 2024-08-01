// src/app/api/getUser/route.ts
import { NextResponse } from "next/server";
import supabase from "@/utils/supabase/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return NextResponse.json({ error: "No chatId provided" }, { status: 400 });
  }

  // Try to fetch the user by chatId
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("id", parseInt(chatId))
    .single();

  if (userError && userError.code !== "PGRST116") {
    console.error("Error fetching user:", userError);
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }

  if (user) {
    // Fetch transactions for the user
    const { data: transactions, error: transactionsError } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id);

    if (transactionsError) {
      console.error("Error fetching transactions:", transactionsError);
      return NextResponse.json(
        { error: "Error fetching transactions" },
        { status: 500 },
      );
    }

    // Return user and transactions
    return NextResponse.json({ id: user.id, transactions });
  } else {
    // No user found, create a new one
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ id: parseInt(chatId) }])
      .select("id")
      .single();

    if (insertError) {
      console.error("Error creating user:", insertError);
      return NextResponse.json(
        { error: "Error creating user" },
        { status: 500 },
      );
    }

    // Return new user with empty transactions
    return NextResponse.json({ id: newUser.id, transactions: [] });
  }
}
