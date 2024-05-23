import BackButton from "@/components/BackButton";
import ButtonAction from "@/components/ButtonAction";

type PageProps = {
  params: {
    id?: string;
  };
};

const BlogDetailPage = ({ params }: PageProps) => {
  return (
    <div>
      <BackButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold my-4">Post One</h2>
        <ButtonAction />
      </div>
      <p className="text-state-700">Post one content</p>
    </div>
  );
};

export default BlogDetailPage;
