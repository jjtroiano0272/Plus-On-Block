import { supabase } from "@/lib/supabase";
import React from "react";

export const fetchData = async (limit = 5) => {
  /* 
    "id": "video",
    "name": "video", */
  try {
    // From storage
    const { data, error } = await supabase.storage.from("video").list();
    getSignedUrls(data);

    // From table
    // const { data, error } = await supabase
    //   .from("moves")
    //   .select("*")
    //   .order("id", { ascending: false });

    return { success: true, data: data };
  } catch (error) {
    console.error(error);
  }
};

let videoFolderPath = `https://gizdlefrudtlzzlsdhyk.supabase.co/storage/v1/object/public/video/`;

// const getVideos = async () => {
//   try {
//     // const { data, error } = await supabase.storage.from("video").list();
//     const { data, error } = await supabase
//       .from("moves")
//       .select("*")
//       .order("id", { ascending: true });

//     console.log(
//       `@getVideos data (expecting uri to just be filename): ${JSON.stringify(
//         data,
//         null,
//         2
//       )}`
//     );

//     // const dataWithIds = data.map((x, index) => ({
//     //   ...x,
//     //   id: (index - 1).toString(),
//     // }));
//     // let fileNames = dataWithIds.map((x) => x.name);

//     // getSignedUrls(fileNames);
//     getSignedUrls(data);
//   } catch (err) {
//     console.error(err);
//   }
// };

let cachePeriod = 60 * 60 * 24 * 7;
export const fetchVideos = async (limit = 3) => {
  try {
    const { data, error } = await supabase
      .from("moves")
      .select("*")
      .order("id", { ascending: true })
      .limit(limit);

    console.log(`@fetchVideos res data: ${JSON.stringify(data, null, 2)}`);

    let res = await getSignedUrls(data);

    return { success: true, data: res.data };
  } catch (err) {
    console.error(err);
    return { success: false, message: err };
  }
};

const getSignedUrls = async (videos: any[]) => {
  try {
    const { data: signedUrls, error } = await supabase.storage
      .from("video")
      // This part REQUIRES just the filename, the way it's setup.
      .createSignedUrls(
        videos.map((video) => video.uri),
        // ["Ryu_5LP.mov"],
        cachePeriod
      );

    const enrichedVideos = signedUrls.map((signedUrlObj, index) => ({
      ...videos[index], // Include all properties of the original video object
      signedUrl: signedUrlObj.signedUrl, // Add the signed URL from the response
    }));

    console.log(`@getSignedUrls: ${JSON.stringify(enrichedVideos, null, 2)}`);

    return { success: true, data: enrichedVideos };
  } catch (err) {
    console.error(err);
    return { success: false, message: err };
  }
};
