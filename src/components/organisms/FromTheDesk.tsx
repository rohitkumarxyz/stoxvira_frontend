import { Container } from "@/components/atoms/Container";
import { PostCard } from "@/components/molecules/PostCard";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { posts } from "@/lib/mock-data";

export function FromTheDesk() {
  return (
    <Container as="section" className="py-16">
      <SectionHeading
        title="From the desk"
        action={
          <a href="#" className="text-label font-medium">
            all notes
          </a>
        }
      />

      <div className="grid gap-x-12 gap-y-8 pt-6 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.title} post={post} />
        ))}
      </div>
    </Container>
  );
}
