// src/app/api/buyToken/route.ts
import { NextResponse } from "next/server";
import supabase from "@/utils/supabase/supabaseClient";

export async function POST(req: Request) {
  try {
    const { userId, tokenSymbol, tokenName, amount, price, type } =
      await req.json();

    // Check if the token exists in the tokens table
    const { data: existingToken, error: tokenError } = await supabase
      .from("tokens")
      .select("symbol")
      .eq("symbol", tokenSymbol)
      .single();

    if (tokenError && tokenError.code !== "PGRST116") {
      console.error("Error checking token:", tokenError);
      return NextResponse.json(
        { error: "Error checking token" },
        { status: 500 },
      );
    }

    // If the token does not exist, insert it
    if (!existingToken) {
      const { error: insertTokenError } = await supabase
        .from("tokens")
        .insert([{ symbol: tokenSymbol, name: tokenName }]);

      if (insertTokenError) {
        console.error("Error inserting token:", insertTokenError);
        return NextResponse.json(
          { error: "Error inserting token" },
          { status: 500 },
        );
      }
    }

    // Insert the new transaction into the transactions table
    const { data: newTransaction, error: transactionError } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: userId,
          token_symbol: tokenSymbol,
          amount,
          price,
          date: new Date().toISOString(),
          type,
        },
      ])
      .single();

    if (transactionError) {
      console.error("Error inserting transaction:", transactionError);
      return NextResponse.json(
        { error: "Error inserting transaction" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Transaction successful",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 },
    );
  }
}
