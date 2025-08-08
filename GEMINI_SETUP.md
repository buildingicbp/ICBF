# Gemini AI Setup Guide

## Prerequisites
1. A Google Cloud account
2. Gemini API access

## Setup Steps

### 1. Install Required Dependencies
Install the PDF generation libraries:

```bash
npm install jspdf html2canvas
```

### 2. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### 3. Add Environment Variable
Create or update your `.env.local` file in the root directory:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Restart Development Server
After adding the environment variable, restart your development server:

```bash
npm run dev
```

## Features

The Enhanced AI Diet Planner includes:

### **Comprehensive Input Collection**
- Gender, age, height, body fat percentage
- Workout frequency and activity level
- Current weight, goal weight, goal body fat
- Primary fitness goal (lose weight, gain muscle, etc.)

### **AI-Powered Detailed Generation**
- Uses Gemini AI to create personalized diet plans
- Generates comprehensive, detailed nutrition advice
- Includes specific portion sizes and cooking methods
- Provides timeline expectations and progress milestones

### **Detailed Plan Sections**
1. **Plan Overview**: Personalized explanation with timeline
2. **Key Recommendations**: 8-10 detailed nutrition tips
3. **Daily Meal Plan**: Specific foods with portions and cooking methods
4. **Nutrition Targets**: Calorie breakdown and macronutrient percentages
5. **Weekly Schedule**: 7-day meal rotation with variety
6. **Shopping List**: Organized by categories (proteins, vegetables, grains, etc.)
7. **Meal Prep Tips**: Detailed strategies and time-saving tips
8. **Hydration Guide**: Specific recommendations with timing
9. **Supplements**: Recommendations with dosages and timing
10. **Progress Tracking**: Methods and metrics for monitoring progress
11. **Plan Adjustments**: How to modify based on results
12. **Nutrition Facts**: Fiber, vitamins, minerals, and omega-3 details

### **PDF Download Feature**
- **Professional PDF Generation**: Creates detailed, formatted PDF documents
- **Multi-page Support**: Automatically handles content overflow
- **Branded Design**: Includes ICBF branding and professional formatting
- **Comprehensive Content**: Includes all plan sections in the PDF
- **Smart Filename**: Auto-generates descriptive filenames with user details
- **Page Numbers**: Professional pagination and footer

### **User Experience Features**
- **Form Validation**: Ensures all required fields are completed
- **Loading States**: Shows spinner during AI generation
- **Toast Notifications**: Success/error feedback for all actions
- **Reset Functionality**: Clear form and results
- **Responsive Design**: Works perfectly on all devices
- **Professional UI**: Matches your website's design language
- **Error Handling**: Graceful fallback if AI fails

## Usage

1. **Access the Feature**:
   - Members: Go to member dashboard → AI Diet Planner tab
   - Trainers: Go to trainer dashboard → AI Diet Planner tab

2. **Generate Diet Plans**:
   - Fill in all user details
   - Click "Generate Diet Plan"
   - View comprehensive personalized nutrition plan

3. **Download PDF**:
   - Click "Download PDF" button in the plan overview section
   - PDF will be automatically generated and downloaded
   - Filename includes user details and date

## API Integration

The system uses the Gemini Pro model to generate comprehensive diet plans. The enhanced prompt is structured to provide:

- **Extremely Detailed Plans**: Specific portions, cooking methods, timing
- **Realistic Expectations**: Timeline and progress milestones
- **Sustainable Approach**: Long-term success strategies
- **Personalized Content**: Tailored to individual goals and fitness level
- **Professional Quality**: Medical-grade nutrition advice

## Error Handling

- **API Failures**: Graceful fallback to detailed mock responses
- **Missing Fields**: Clear validation messages
- **PDF Generation**: Error handling with user feedback
- **Network Issues**: Retry mechanisms and user guidance
- **Browser Compatibility**: Works across all modern browsers

## PDF Features

The generated PDF includes:

- **Professional Header**: ICBF branding and title
- **User Information**: Personal details and goals
- **Comprehensive Sections**: All plan details organized clearly
- **Multi-page Layout**: Automatic page breaks for long content
- **Color Coding**: Visual organization with consistent styling
- **Footer**: Page numbers and branding
- **Print-Ready**: Optimized for printing and sharing

## Technical Implementation

- **Dynamic Imports**: PDF libraries loaded only when needed
- **Type Safety**: Full TypeScript interfaces for all data structures
- **Modular Design**: Clean separation of concerns
- **Performance Optimized**: Efficient rendering and processing
- **Accessibility**: Proper ARIA labels and keyboard navigation 