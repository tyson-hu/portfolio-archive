import { ImageResponse } from "next/og";
import { PORTFOLIO } from "@/data/portfolio";

const { identity } = PORTFOLIO;

export const alt = identity.name;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const styles = {
  outerWrapper: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    position: "relative",
  },
  middleWrapper: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    position: "relative",
    padding: "40px",
  },
  wrapper: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fafafa",
    position: "relative",
    padding: "40px",
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
  },
  imageSection: {
    position: "absolute",
    top: "40px",
    left: "40px",
    display: "flex",
    alignItems: "center",
    zIndex: "2",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    height: "100%",
    width: "100%",
    position: "relative",
    zIndex: "1",
  },
  image: {
    width: "140px",
    height: "140px",
    borderRadius: "24px",
    border: "4px solid #e5e5e5",
    objectFit: "cover",
  },
  initials: {
    width: "140px",
    height: "140px",
    borderRadius: "24px",
    border: "4px solid #e5e5e5",
    backgroundColor: "#171717",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, sans-serif",
    fontSize: "48px",
    fontWeight: "600",
  },
  title: {
    fontFamily: "system-ui, sans-serif",
    fontSize: "48px",
    fontWeight: "600",
    lineHeight: "1.1",
    textAlign: "left",
    color: "#000000",
    marginBottom: "16px",
    letterSpacing: "-0.02em",
    maxWidth: "900px",
  },
  description: {
    fontFamily: "system-ui, sans-serif",
    fontSize: "20px",
    fontWeight: "400",
    lineHeight: "1.5",
    textAlign: "left",
    maxWidth: "800px",
    color: "#404040",
    marginBottom: "32px",
  },
} as const;

function resolveImageUrl(url: string, baseUrl: string) {
  return url.startsWith("http") ? url : new URL(url, baseUrl).toString();
}

async function loadAvatarSrc(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) return undefined;

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("png") && !contentType.includes("jpeg")) {
      return undefined;
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mime = contentType.includes("jpeg") ? "image/jpeg" : "image/png";
    return `data:${mime};base64,${base64}`;
  } catch {
    return undefined;
  }
}

export default async function Image() {
  const imageUrl = identity.avatarUrl
    ? resolveImageUrl(identity.avatarUrl, identity.url)
    : undefined;
  const avatarSrc = imageUrl ? await loadAvatarSrc(imageUrl) : undefined;

  return new ImageResponse(
    (
      <div style={styles.outerWrapper}>
        <div style={styles.middleWrapper}>
          <div style={styles.wrapper}>
            <div style={styles.imageSection}>
              {avatarSrc ? (
                <img src={avatarSrc} alt={identity.name} style={styles.image} />
              ) : (
                <div style={styles.initials}>{identity.initials}</div>
              )}
            </div>
            <div style={styles.mainContainer}>
              <div style={styles.title}>{identity.name}</div>
              {identity.description && (
                <div style={styles.description}>{identity.description}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
