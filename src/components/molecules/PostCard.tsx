import { Overline } from "@/components/atoms/Overline";
import type { Post } from "@/lib/mock-data";

/** A note in "From the desk". */
export function PostCard({ post }: { post: Post }) {
  return (
    <article className="rule-b-subtle flex flex-col gap-2 pb-6">
      <Overline tone="muted">
        {`${post.cat} · ${post.date} · ${post.read}`.toUpperCase()}
      </Overline>
      <h3 className="text-lg font-bold tracking-[-0.2px]">{post.title}</h3>
      <p className="text-body text-muted">{post.dek}</p>
    </article>
  );
}
