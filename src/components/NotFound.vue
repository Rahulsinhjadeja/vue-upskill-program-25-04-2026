<template>
    <div class="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
        <h1 class="display-1 fw-bold text-secondary">404</h1>
        <h2 class="mb-4">Page Not Found</h2>
        <p class="text-muted mb-4">
            The page you are looking for doesn't exist or has been moved.
        </p>
        <RouterLink to="/discover" class="btn btn-danger btn-lg">
            <i class="fa-solid fa-house me-2"></i>Home
        </RouterLink>
    </div>
</template>
