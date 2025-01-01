import 'react-multi-carousel/lib/styles.css'

import React from 'react'
import Carousel from 'react-multi-carousel'
import { Link } from 'react-router-dom'

import {
  aiSuggestionsImage,
  analyticsImage,
  focusTimerImage,
  personalizedFeedbackImage,
  seamlessSchedulingImage,
  step1Image,
  step2Image,
  step3Image,
  taskManagementImage,
  userTestimonial1Image,
  userTestimonial2Image,
  userTestimonial3Image,
  userTestimonial5Image
} from '@/assets/images'

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 3
  },
  desktop: {
    breakpoint: { max: 1024, min: 768 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 768, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
}

const LandingPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-100 text-gray-800'>
      {/* Header Section */}
      <header className='bg-blue-600 text-white py-6 px-4'>
        <div className='container mx-auto flex justify-between items-center'>
          <h1 className='text-3xl font-bold'>AI-powered Study Planner</h1>
          <div>
            <Link
              to='/login'
              className='bg-white text-blue-600 px-4 py-2 rounded-md font-semibold mr-4 hover:bg-gray-200'
            >
              Login
            </Link>
            <Link
              to='/register'
              className='bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-200'
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='relative bg-white py-12'>
        <video className='absolute inset-0 w-full h-full object-cover opacity-30' autoPlay loop muted>
          <source src='/path-to-your-video.mp4' type='video/mp4' />
          Your browser does not support the video tag.
        </video>
        <div className='relative container mx-auto text-center z-10'>
          <h2 className='text-4xl font-bold mb-6'>Manage Your Study Time Effectively</h2>
          <p className='text-lg mb-6 text-gray-600'>
            Unlock your potential with personalized scheduling, focus tools, and insights.
          </p>
          <Link
            to='/register'
            className='bg-blue-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-blue-700'
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-yellow-100 py-12 px-4 md:px-8 lg:px-12'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          <div className='p-6 bg-white shadow-md rounded-md'>
            <img src={taskManagementImage} alt='Task Management' className='w-full h-40 object-cover mb-4 rounded-md' />

            <h3 className='text-2xl font-bold mb-4'>Task Management</h3>
            <p className='text-gray-600'>
              Organize your tasks efficiently with priority levels, status updates, and detailed descriptions.
            </p>
          </div>
          <div className='p-6 bg-white shadow-md rounded-md'>
            <img src={aiSuggestionsImage} alt='Task Management' className='w-full h-40 object-cover mb-4 rounded-md' />
            <h3 className='text-2xl font-bold mb-4'>AI Suggestions</h3>
            <p className='text-gray-600'>
              Leverage AI to analyze your schedule and optimize for better focus and balance.
            </p>
          </div>
          <div className='p-6 bg-white shadow-md rounded-md'>
            <img src={focusTimerImage} alt='Task Management' className='w-full h-40 object-cover mb-4 rounded-md' />
            <h3 className='text-2xl font-bold mb-4'>Focus Timer</h3>
            <p className='text-gray-600'>
              Stay on track with Pomodoro sessions and achieve your study goals efficiently.
            </p>
          </div>
          <div className='p-6 bg-white shadow-md rounded-md'>
            <img src={analyticsImage} alt='Task Management' className='w-full h-40 object-cover mb-4 rounded-md' />
            <h3 className='text-2xl font-bold mb-4'>Analytics</h3>
            <p className='text-gray-600'>Visualize your progress and gain insights to improve your learning habits.</p>
          </div>
          <div className='p-6 bg-white shadow-md rounded-md'>
            <img
              src={personalizedFeedbackImage}
              alt='Task Management'
              className='w-full h-40 object-cover mb-4 rounded-md'
            />
            <h3 className='text-2xl font-bold mb-4'>Personalized Feedback</h3>
            <p className='text-gray-600'>
              Receive motivational feedback and suggestions tailored to your learning journey.
            </p>
          </div>
          <div className='p-6 bg-white shadow-md rounded-md'>
            <img
              src={seamlessSchedulingImage}
              alt='Task Management'
              className='w-full h-40 object-cover mb-4 rounded-md'
            />
            <h3 className='text-2xl font-bold mb-4'>Seamless Scheduling</h3>
            <p className='text-gray-600'>
              Plan your study sessions with an intuitive drag-and-drop calendar interface.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      {/* Testimonials Section */}
      <section className='bg-white py-12'>
        <div className='container mx-auto text-center'>
          <h2 className='text-3xl font-bold mb-6'>What Our Users Say</h2>

          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            keyBoardControl={true}
            showDots={true}
            arrows={true}
          >
            <div className='flex items-center p-6 rounded-md hover:shadow-lg transition-shadow'>
              <img
                src={userTestimonial1Image}
                alt='User Testimonial'
                className='w-20 h-20 object-cover rounded-full mr-4'
              />
              <div className='text-left'>
                <p className='text-gray-600 mb-2'>
                  &quot;This planner has completely changed how I manage my study time. The AI suggestions are spot
                  on!&quot;
                </p>
                <h4 className='font-bold text-lg'>- Alex M.</h4>
              </div>
            </div>

            <div className='flex items-center p-6 rounded-md hover:shadow-lg transition-shadow'>
              <img
                src={userTestimonial2Image}
                alt='User Testimonial'
                className='w-20 h-20 object-cover rounded-full mr-4'
              />
              <div className='text-left'>
                <p className='text-gray-600 mb-2'>
                  &quot;The focus timer helps me stay productive, and the analytics keep me motivated to improve.&quot;
                </p>
                <h4 className='font-bold text-lg'>- Sarah L.</h4>
              </div>
            </div>

            <div className='flex items-center p-6 rounded-md hover:shadow-lg transition-shadow'>
              <img
                src={userTestimonial3Image}
                alt='User Testimonial'
                className='w-20 h-20 object-cover rounded-full mr-4'
              />
              <div className='text-left'>
                <p className='text-gray-600 mb-2'>
                  &quot;I love how easy it is to schedule tasks and track my progress. Highly recommend!&quot;
                </p>
                <h4 className='font-bold text-lg'>- Michael T.</h4>
              </div>
            </div>
            <div className='flex items-center p-6 rounded-md hover:shadow-lg transition-shadow'>
              <img
                src={userTestimonial5Image}
                alt='User Testimonial'
                className='w-20 h-20 object-cover rounded-full mr-4'
              />
              <div className='text-left'>
                <p className='text-gray-600 mb-2'>
                  &quot;I love how easy it is to schedule tasks and track my progress. Highly recommend it!&quot;
                </p>
                <h4 className='font-bold text-lg'>- Michael TS.</h4>
              </div>
            </div>
          </Carousel>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='bg-blue-50 py-12 px-4 md:px-8 lg:px-12'>
        <div className='container mx-auto text-center'>
          <h2 className='text-3xl font-bold mb-6'>How It Works</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='p-6 bg-white shadow-md rounded-md'>
              <img src={step1Image} alt='Task Management' className='w-full h-40 object-cover mb-4 rounded-md' />
              <h3 className='text-2xl font-bold mb-4'>Step 1</h3>
              <p className='text-gray-600'>Sign up and create your profile to get started.</p>
            </div>
            <div className='p-6 bg-white shadow-md rounded-md'>
              <img src={step2Image} alt='Task Management' className='w-full h-40 object-cover mb-4 rounded-md' />
              <h3 className='text-2xl font-bold mb-4'>Step 2</h3>
              <p className='text-gray-600'>Add your tasks and organize them on the calendar.</p>
            </div>
            <div className='p-6 bg-white shadow-md rounded-md'>
              <img src={step3Image} alt='Task Management' className='w-full h-40 object-cover mb-4 rounded-md' />
              <h3 className='text-2xl font-bold mb-4'>Step 3</h3>
              <p className='text-gray-600'>Use AI feedback and analytics to optimize your learning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className='bg-blue-600 text-white py-12'>
        <div className='container mx-auto text-center'>
          <h2 className='text-3xl font-bold mb-6'>Ready to Transform Your Study Routine?</h2>
          <p className='text-lg mb-6'>
            Join thousands of learners who are optimizing their time and achieving their goals with our Study Planner.
          </p>
          <Link
            to='/register'
            className='bg-white text-blue-600 px-6 py-3 rounded-md font-semibold text-lg hover:bg-gray-200'
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className='bg-gray-800 text-gray-300 py-6'>
        <div className='container mx-auto text-center'>
          <p>&copy; 2024 AI-powered Study Planner. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
