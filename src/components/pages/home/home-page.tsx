import heroImage from "@/assets/images/hero/hero-image-1.jpg"
import SearchBar from "@/components/common/input/search-bar"

const HomePage = () => {
  return (
    <div className="flex flex-col gap-8">
      <section id="hero">
        <div className="relative h-[600px] bg-zinc-200 rounded-md overflow-hidden">
          <div className="text-center flex flex-col gap-8 items-center justify-center relative z-10 h-full w-full p-16 backdrop-brightness-90">
            <h2 className="text-6xl font-light text-primary-foreground">Temukan <span className="font-semibold">ubin</span> yang sesuai dengan <span className="font-semibold">kebutuhan anda</span>!</h2>
            
            <div className="max-w-[700px]">
              <SearchBar/>
            </div>
          </div>
          <div className="absolute inset-0">  
            <img src={heroImage} alt="Hero Image" className="w-full h-full block object-center object-cover" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage