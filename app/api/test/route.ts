import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

type ResponseData = {
  message: string;
};

export async function GET(req: Request, context: any) {
  //   const { username } = con.;
  const url = new URL(req.url);

  const username = url.searchParams.get("username");

  let backednUrl = `http://146.190.32.67/profile-report?username=${username}`;

  let res = await axios.get(backednUrl);
  let data = res.data;
  return NextResponse.json(data, {
    status: 200,
  });
}
