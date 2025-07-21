
import ModernCard from "./ModernCard";

const ModernCardDemo = () => {
  const handleReadMore = () => {
    console.log("Read more clicked!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 p-8 flex items-center justify-center">
      <div className="max-w-5xl w-full">
        <ModernCard
          date="26 December 2019"
          title="Lorem Ipsum Dolor"
          description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae voluptate repellendus magni illo ea animi?"
          onReadMore={handleReadMore}
          image="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop"
        />
        
        <div className="mt-8">
          <ModernCard
            date="15 January 2024"
            title="Music Learning Journey"
            description="Discover the art of Indian classical music with our expert teachers. Join thousands of students who have transformed their musical abilities."
            onReadMore={handleReadMore}
          />
        </div>
      </div>
    </div>
  );
};

export default ModernCardDemo;
