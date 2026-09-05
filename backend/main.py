from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import engine, Base
from routers import (
    auth_router,
    enquiries_router,
    services_router,
    portfolio_router,
    blog_router
)
import seed

# Initialize tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router.router, prefix=settings.API_V1_STR)
app.include_router(enquiries_router.router, prefix=settings.API_V1_STR)
app.include_router(services_router.router, prefix=settings.API_V1_STR)
app.include_router(portfolio_router.router, prefix=settings.API_V1_STR)
app.include_router(blog_router.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def on_startup():
    try:
        seed.seed_database()
    except Exception as e:
        print(f"Seed note: {e}")

@app.get("/")
def root():
    return {
        "agency": "GetIntoFeed",
        "tagline": "Creative Growth Studio",
        "api_docs": "/docs",
        "status": "operational"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "getintofeed-fastapi-core"}
