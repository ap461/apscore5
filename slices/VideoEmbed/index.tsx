import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

export type VideoEmbedProps = SliceComponentProps<Content.VideoEmbedSlice>;

const VideoEmbed: FC<VideoEmbedProps> = ({ slice }) => {
  const youtubeId = slice.primary?.youtube_id?.trim();
  if (!youtubeId) return null;

  const eyebrow = slice.primary?.eyebrow;
  const placeholderText = slice.primary?.placeholder_text;
  const titleField = slice.primary?.title;
  const hasTitle = Array.isArray(titleField) && titleField.length > 0;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="container">
        <div className="video-embed">
          {(eyebrow || hasTitle) && (
            <div className="video-head">
              {eyebrow && <div className="kicker">{eyebrow}</div>}
              <PrismicRichText
                field={titleField}
                components={{
                  heading3: ({ children }) => <h2>{children}</h2>,
                }}
              />
            </div>
          )}
          <div className="video-embed-frame">
            <iframe
              src={`https://www.youtube.com/embed/${encodeURIComponent(youtubeId)}`}
              title={placeholderText ?? "Course overview video"}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          {placeholderText && (
            <p className="sdesc caption">{placeholderText}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoEmbed;
