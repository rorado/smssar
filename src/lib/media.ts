export function getVideoThumbnailUrl(url: string) {
  if (!url.includes("/video/upload/")) {
    return url;
  }

  return url.replace(
    "/video/upload/",
    "/video/upload/f_jpg,so_1,w_1200,h_675,c_fill,g_auto/",
  );
}
